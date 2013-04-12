MACRO(LINK_HIFI_LIBRARY LIBRARY TARGET ROOT_DIR)
    if (NOT TARGET ${LIBRARY})
        add_subdirectory(${ROOT_DIR}/libraries/${LIBRARY} ${ROOT_DIR}/libraries/${LIBRARY})
    endif (NOT TARGET ${LIBRARY})
    
    string(TOUPPER ${LIBRARY} UPPERCASED_LIBRARY_NAME)
    set(HIFI_LIBRARY_PROPERTY "HIFI_${UPPERCASED_LIBRARY_NAME}_LIBRARY")
    get_directory_property(HIFI_LIBRARY 
                           DIRECTORY ${ROOT_DIR}/libraries/${LIBRARY} 
                           DEFINITION ${HIFI_LIBRARY_PROPERTY})
    
    include_directories(${ROOT_DIR}/libraries/${LIBRARY}/src)

    add_dependencies(${TARGET} ${LIBRARY})
    target_link_libraries(${TARGET} ${LIBRARY})
    
    if (APPLE)
      # currently the "shared" library requires CoreServices    
      # link in required OS X framework
      set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} -framework CoreServices")
    endif (APPLE)
ENDMACRO(LINK_HIFI_LIBRARY _library _target _root_dir)
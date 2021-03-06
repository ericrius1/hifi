include(ExternalProject)

set(EXTERNAL_NAME neuron)

string(TOUPPER ${EXTERNAL_NAME} EXTERNAL_NAME_UPPER)

set(NEURON_URL "https://s3.amazonaws.com/hifi-public/dependencies/neuron_datareader_b.12.zip")
set(NEURON_URL_MD5 "0ab54ca04c9cc8094e0fa046c226e574")

ExternalProject_Add(${EXTERNAL_NAME}
                    URL ${NEURON_URL}
                    URL_MD5 ${NEURON_URL_MD5}
                    CONFIGURE_COMMAND ""
                    BUILD_COMMAND ""
                    INSTALL_COMMAND ""
                    LOG_DOWNLOAD 1)

ExternalProject_Get_Property(${EXTERNAL_NAME} SOURCE_DIR)

set_target_properties(${EXTERNAL_NAME} PROPERTIES FOLDER "hidden/externals")

# set include dir
if(WIN32)
    set(${EXTERNAL_NAME_UPPER}_INCLUDE_DIRS "${SOURCE_DIR}/NeuronDataReader_Windows/include" CACHE TYPE INTERNAL)
elseif(APPLE)
    set(${EXTERNAL_NAME_UPPER}_INCLUDE_DIRS "${SOURCE_DIR}/NeuronDataReader_Mac/include" CACHE TYPE INTERNAL)
else()
    # Unsupported
endif()

if(WIN32)

    if("${CMAKE_SIZEOF_VOID_P}" EQUAL "8")
        set(ARCH_DIR "x64")
    else()
        set(ARCH_DIR "x86")
    endif()

    set(${EXTERNAL_NAME_UPPER}_LIB_PATH "${SOURCE_DIR}/NeuronDataReader_Windows/lib/${ARCH_DIR}")
    set(${EXTERNAL_NAME_UPPER}_LIBRARY_RELEASE "${${EXTERNAL_NAME_UPPER}_LIB_PATH}/NeuronDataReader.lib" CACHE TYPE INTERNAL)
    set(${EXTERNAL_NAME_UPPER}_LIBRARIES "${${EXTERNAL_NAME_UPPER}_LIB_PATH}/NeuronDataReader.lib" CACHE TYPE INTERNAL)

    add_paths_to_fixup_libs("${${EXTERNAL_NAME_UPPER}_LIB_PATH}")

elseif(APPLE)

    set(${EXTERNAL_NAME_UPPER}_LIB_PATH "${SOURCE_DIR}/NeuronDataReader_Mac/dylib")
    set(${EXTERNAL_NAME_UPPER}_LIBRARY_RELEASE "${${EXTERNAL_NAME_UPPER}_LIB_PATH}/NeuronDataReader.dylib" CACHE TYPE INTERNAL)
    set(${EXTERNAL_NAME_UPPER}_LIBRARIES "${${EXTERNAL_NAME_UPPER}_LIB_PATH}/NeuronDataReader.dylib" CACHE TYPE INTERNAL)

    add_paths_to_fixup_libs("${${EXTERNAL_NAME_UPPER}_LIB_PATH}")

else()
    # UNSUPPORTED
endif()


//
//  Created by Bradley Austin Davis on 2015-12-15
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#ifndef hifi_ui_QmlWindowClass_h
#define hifi_ui_QmlWindowClass_h

#include <QtCore/QObject>
#include <QtCore/QPointer>
#include <QtScript/QScriptValue>
#include <QtQuick/QQuickItem>

#include <GLMHelpers.h>

class QScriptEngine;
class QScriptContext;

// FIXME refactor this class to be a QQuickItem derived type and eliminate the needless wrapping 
class QmlWindowClass : public QObject {
    Q_OBJECT
    Q_PROPERTY(QObject* eventBridge READ getEventBridge CONSTANT)
    Q_PROPERTY(glm::vec2 position READ getPosition WRITE setPosition NOTIFY positionChanged)
    Q_PROPERTY(glm::vec2 size READ getSize WRITE setSize NOTIFY sizeChanged)
    Q_PROPERTY(bool visible READ isVisible WRITE setVisible NOTIFY visibilityChanged)

public:
    static QScriptValue constructor(QScriptContext* context, QScriptEngine* engine);
    QmlWindowClass(QObject* qmlWindow);
    ~QmlWindowClass();

public slots:
    bool isVisible() const;
    void setVisible(bool visible);

    glm::vec2 getPosition() const;
    void setPosition(const glm::vec2& position);
    void setPosition(int x, int y);

    glm::vec2 getSize() const;
    void setSize(const glm::vec2& size);
    void setSize(int width, int height);
    void setTitle(const QString& title);

    Q_INVOKABLE void raise();
    Q_INVOKABLE void close();
    Q_INVOKABLE QObject* getEventBridge() { return this; };

    // Scripts can use this to send a message to the QML object
    void sendToQml(const QVariant& message);

signals:
    void visibilityChanged(bool visible);  // Tool window
    void positionChanged();
    void sizeChanged();
    void moved(glm::vec2 position);
    void resized(QSizeF size);
    void closed();
    // Scripts can connect to this signal to receive messages from the QML object
    void fromQml(const QVariant& message);

protected slots:
    void hasClosed();

protected:
    static QScriptValue internalConstructor(const QString& qmlSource, 
        QScriptContext* context, QScriptEngine* engine, 
        std::function<QmlWindowClass*(QObject*)> function);

    QQuickItem* asQuickItem() const;

    // FIXME needs to be initialized in the ctor once we have support
    // for tool window panes in QML
    bool _toolWindow { false };
    QPointer<QObject> _qmlWindow;
    QString _source;
};

#endif

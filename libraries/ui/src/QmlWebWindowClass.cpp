//
//  Created by Bradley Austin Davis on 2015-12-15
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#include "QmlWebWindowClass.h"

#include <QtCore/QUrl>
#include <QtCore/QUrlQuery>
#include <QtCore/QThread>

#include <QtQml/QQmlContext>

#include <QtWebChannel/QWebChannel>

#include <QtScript/QScriptContext>
#include <QtScript/QScriptEngine>

#include <QtQuick/QQuickItem>

#include <AbstractUriHandler.h>
#include <AccountManager.h>
#include <AddressManager.h>
#include <DependencyManager.h>

#include "OffscreenUi.h"

static const char* const URL_PROPERTY = "source";

// Method called by Qt scripts to create a new web window in the overlay
QScriptValue QmlWebWindowClass::constructor(QScriptContext* context, QScriptEngine* engine) {
    return QmlWindowClass::internalConstructor("QmlWebWindow.qml", context, engine,
        [&](QObject* object) {  return new QmlWebWindowClass(object);  });
}

QmlWebWindowClass::QmlWebWindowClass(QObject* qmlWindow) : QmlWindowClass(qmlWindow) {
    _uid = QUuid::createUuid().toString();
    asQuickItem()->setProperty("uid", _uid);
    auto webchannelVar = qmlWindow->property("webChannel");
    _webchannel = qvariant_cast<QWebChannel*>(webchannelVar);
    Q_ASSERT(_webchannel);
    _webchannel->registerObject(_uid, this);
}

void QmlWebWindowClass::emitScriptEvent(const QVariant& scriptMessage) {
    if (QThread::currentThread() != thread()) {
        QMetaObject::invokeMethod(this, "emitScriptEvent", Qt::QueuedConnection, Q_ARG(QVariant, scriptMessage));
    } else {
        emit scriptEventReceived(scriptMessage);
    }
}

void QmlWebWindowClass::emitWebEvent(const QVariant& webMessage) {
    if (QThread::currentThread() != thread()) {
        QMetaObject::invokeMethod(this, "emitWebEvent", Qt::QueuedConnection, Q_ARG(QVariant, webMessage));
    } else {
        emit webEventReceived(webMessage);
    }
}

QString QmlWebWindowClass::getURL() const {
    QVariant result = DependencyManager::get<OffscreenUi>()->returnFromUiThread([&]()->QVariant {
        if (_qmlWindow.isNull()) {
            return QVariant();
        }
        return _qmlWindow->property(URL_PROPERTY);
    });
    return result.toString();
}

// HACK find a good place to declare and store this
extern QString fixupHifiUrl(const QString& urlString);

void QmlWebWindowClass::setURL(const QString& urlString) {
    DependencyManager::get<OffscreenUi>()->executeOnUiThread([=] {
        if (!_qmlWindow.isNull()) {
            _qmlWindow->setProperty(URL_PROPERTY, fixupHifiUrl(urlString));
        }
    });
}

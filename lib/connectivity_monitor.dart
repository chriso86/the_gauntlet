import 'dart:async';
import 'package:connectivity/connectivity.dart';
import 'package:flutter/material.dart';

class ConnectivityMonitor extends StatefulWidget {
  @override
  ConnectivityMonitorState createState() => new ConnectivityMonitorState();
}

class ConnectivityMonitorState extends State<ConnectivityMonitor> {
  final Connectivity connectivity = new Connectivity();
  bool isConnected = false;
  StreamSubscription<ConnectivityResult> connectionSubscription;

  @override
  void initState() {
    // Register connectivity state listener
    setConnectivityStateListener();

    // Set the initial state of the connectivity
    setInitialConnectivityState();

    super.initState();
  }

  @override
  void dispose() {
    closeSubsciption();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.topCenter,
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).size.height * .15,
        bottom: MediaQuery.of(context).size.height * .15,
      ),
      child: new Visibility(
        visible: !isConnected,
        child: Card(
          child: Padding(
              padding: EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.max,
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  new Text(
                    'No Wifi detected',
                    style: TextStyle(
                        color: Colors.black87,
                        fontSize: 36,
                        fontWeight: FontWeight.bold),
                  ),
                  new SizedBox(
                    height: 30.0,
                  ),
                  new Text(
                    'Since this game is multiplayer, it relies on wifi connectivity. Please connect to a wifi network to continue',
                    style: TextStyle(
                      color: Colors.black87,
                      fontSize: 24,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  new SizedBox(
                    height: 30.0,
                  ),
                  new Text(
                    'Waiting for wifi connection',
                    style: TextStyle(
                      color: Colors.blue,
                      fontSize: 24,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              )),
        ),
      ),
    );
  }

  setConnectivityStateListener() {
    setInitialConnectivityState();

    connectionSubscription =
        connectivity.onConnectivityChanged.listen((ConnectivityResult result) {
          setState(() {
            if (result == ConnectivityResult.wifi) {
              isConnected = true;
            } else {
              isConnected = false;
            }
          });
        });
  }

  setInitialConnectivityState() {
    connectivity.checkConnectivity().then((ConnectivityResult result) {
      setState(() {
        if (result == ConnectivityResult.wifi) {
          isConnected = true;
        } else {
          isConnected = false;
        }
      });
    });
  }

  closeSubsciption() {
    connectionSubscription.cancel();
  }
}
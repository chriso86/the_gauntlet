import 'package:flutter/material.dart';
import 'package:the_gauntlet/server_options.dart';
import 'connectivity_monitor.dart';

class MainMenu extends StatefulWidget {
  @override
  _MainMenuState createState() => new _MainMenuState();
}

class _MainMenuState extends State<MainMenu> {
  @override
  Widget build(BuildContext context) {
    return Stack(children: <Widget>[
      // Main Menu Content
      Scaffold(
          body: Container(
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: AssetImage("images/background.jpg"),
                  fit: BoxFit.cover,
                ),
              ),
              child: Center(
                  child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: <Widget>[
                    Container(
                      height: 210.0,
                      decoration: BoxDecoration(
                          image: DecorationImage(
                              image: AssetImage("images/logo.png"),
                              fit: BoxFit.fitHeight)),
                    ),
                    SizedBox(
                      height: 30.0,
                    ),
                    RaisedButton(
                        color: Colors.black,
                        highlightColor: Colors.white10,
                        padding: EdgeInsets.symmetric(vertical: 30.0),
                        onPressed: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => ServerOptions()));
                        },
                        child: const Text('New Game',
                            style: TextStyle(
                                fontSize: 36,
                                fontFamily: 'Primer',
                                color: Colors.white70))),
                    RaisedButton(
                        color: Colors.black,
                        highlightColor: Colors.white10,
                        padding: EdgeInsets.symmetric(vertical: 30.0),
                        onPressed: () {},
                        child: const Text('Join Game',
                            style: TextStyle(
                                fontSize: 36,
                                fontFamily: 'Primer',
                                color: Colors.white70)))
                  ])))),
      // No WIFI Message
      ConnectivityMonitor()
    ]);
  }
}

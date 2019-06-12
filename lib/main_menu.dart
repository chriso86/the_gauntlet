import 'package:flutter/material.dart';

class MainMenu extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                      onPressed: () {},
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
                ]))));
  }
}

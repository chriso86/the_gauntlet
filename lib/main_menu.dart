import 'package:flutter/material.dart';
import 'package:the_gauntlet/server_options.dart';
import 'package:the_gauntlet/user_profile.dart';
import 'connectivity_monitor.dart';
import 'document_storage.dart';

class MainMenu extends StatefulWidget {
  @override
  _MainMenuState createState() => new _MainMenuState();
}

class _MainMenuState extends State<MainMenu> {
  final documentStorage = new DocumentStorage();

  // State
  bool _editingName = false;

  @override
  Widget build(BuildContext context) {
    String _playerName = UserProfile.of(context).playerName;
    TextEditingController _playerNameController = new TextEditingController();

    return Stack(children: <Widget>[
      // Main Menu Content
      Scaffold(
          appBar: AppBar(

            backgroundColor: Colors.black,
            leading: Icon(Icons.person, size: 26.0),
            title: Text(_playerName,
                style: TextStyle(color: Colors.white, fontSize: 20.0)),
            actions: <Widget>[
              IconButton(
                icon: Icon(Icons.edit),
                onPressed: () {
                  setState(() {
                    _editingName = true;
                  });
                },
              )
            ],
          ),
          body: SingleChildScrollView(
            child: Container(
                height: MediaQuery.of(context).size.height,
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
                    ]))),
          )),

      Container(
        alignment: Alignment.topCenter,
        child: new Visibility(
          visible: _editingName,
          child: Card(
            child: Padding(
                padding: EdgeInsets.all(20.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Text(
                      'Enter your name:',
                      style: TextStyle(fontSize: 26.0),
                    ),
                    TextFormField(
                      controller: _playerNameController,
                      autofocus: true,
                      style: TextStyle(fontSize: 26.0),
                    ),
                    new SizedBox(
                      height: 30.0,
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: <Widget>[
                        IconButton(
                          icon: Icon(Icons.close),
                          iconSize: 36.0,
                          onPressed: () {
                            setState(() {
                              _editingName = false;
                            });
                          },
                        ),
                        SizedBox(
                          width: 10.0,
                        ),
                        IconButton(
                          icon: Icon(Icons.done),
                          iconSize: 36.0,
                          onPressed: () {
                            setState(() {
                              UserProfile.of(context).playerName =
                                  _playerNameController.text;

                              _editingName = false;
                            });
                          },
                        ),
                      ],
                    )
                  ],
                )),
          ),
        ),
      ),

      // No WIFI Message
      ConnectivityMonitor()
    ]);
  }
}

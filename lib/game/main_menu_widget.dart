import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:the_gauntlet/connection/connectivity_monitor_widget.dart';
import 'package:the_gauntlet/server/server_options_widget.dart';
import 'package:the_gauntlet/user/user_profile.dart';

class MainMenu extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    TextEditingController _playerNameController = new TextEditingController();
    UserProfileNotifier userProfileNotifier =
        Provider.of<UserProfileNotifier>(context);

    return Stack(children: <Widget>[
      // Main Menu Content
      Scaffold(
          appBar: AppBar(
            backgroundColor: Colors.black,
            leading: Icon(Icons.person, size: 26.0),
            title: Text(userProfileNotifier.playerName,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20.0,
                )),
            actions: <Widget>[
              IconButton(
                icon: Icon(Icons.edit),
                onPressed: () {
                  userProfileNotifier.editingPlayerName = true;
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
                            Navigator.of(context).push(
                              PageRouteBuilder(
                                pageBuilder: (context, animation, secondaryAnimation) => ServerOptions(),
                                transitionsBuilder: (context, animation, secondaryAnimation, child) {
                                  return ServerOptions();
                                }
                              )
                            );
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

      // Player Name Form
      Container(
        alignment: Alignment.topCenter,
        child: new Visibility(
          visible: userProfileNotifier.editingPlayerName,
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
                    Consumer<UserProfileNotifier>(
                        builder: (context, userProfile, _) {
                      _playerNameController.text = userProfile.playerName;
                      _playerNameController.selection =
                          TextSelection.fromPosition(TextPosition(
                              offset: userProfile.playerName.length));

                      return TextFormField(
                        controller: _playerNameController,
                        autofocus: true,
                        style: TextStyle(fontSize: 26.0),
                      );
                    }),
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
                            userProfileNotifier.editingPlayerName = false;
                          },
                        ),
                        SizedBox(
                          width: 10.0,
                        ),
                        IconButton(
                          icon: Icon(Icons.done),
                          iconSize: 36.0,
                          onPressed: () {
                            userProfileNotifier
                                .setPlayerName(_playerNameController.text);
                            userProfileNotifier.editingPlayerName = false;
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

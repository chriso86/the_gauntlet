import 'package:flutter/material.dart';

import '../storage/storage_repository.dart';

class UserProfile extends InheritedWidget {
  final documentStorage = new StorageRepository();

  String playerName = 'Wanderer';

  UserProfile({Key key, @required Widget child})
      : super(key: key, child: child);

  static UserProfile of(BuildContext context) {
    return context.inheritFromWidgetOfExactType(UserProfile);
  }

  void setPlayerName(String name) {
    playerName = name;

    documentStorage.setPlayerName(name);

    print('Player name set to $playerName');
  }

  String getPlayerName() {
    documentStorage.getPlayerName()
        .then((String name) {
      playerName = name;

      return playerName;
    });
  }

  @override
  bool updateShouldNotify(UserProfile oldWidget) => true;
}

import 'package:flutter/material.dart';

import 'document_storage.dart';

class UserProfile extends InheritedWidget {
  final documentStorage = new DocumentStorage();

  String _playerName = 'Wanderer';

  UserProfile({
    Key key,
    @required Widget child
  }): super(key: key, child: child);

  static UserProfile of (BuildContext context) {
    return context.inheritFromWidgetOfExactType(UserProfile);
  }

  set playerName(String name) {
    _playerName = name;

    documentStorage.setPlayerName(name);

    print('Player name set to $name');
  }

  get playerName {
    return _playerName;
  }

  @override bool updateShouldNotify(UserProfile oldWidget) =>
    false;
}
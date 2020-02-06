import 'package:flutter/material.dart';
import '../storage/storage_repository.dart';

class UserProfileNotifier with ChangeNotifier {
  StorageRepository storageRepository;
  String _playerNameKey = 'PlayerName';
  String _playerName = 'Wanderer';
  bool _editingPlayerName = false;

  String get playerName {
    return _playerName;
  }
  bool get editingPlayerName {
    return _editingPlayerName;
  }
  set editingPlayerName(bool isEditing) {
    _editingPlayerName = isEditing;

    notifyListeners();
  }

  UserProfileNotifier() {
    storageRepository = StorageRepository();

    storageRepository.readKeyValue(_playerNameKey).then((name) {
      _playerName = name;
    });
  }

  void setPlayerName(String playerName) async {
    _playerName = playerName;

    await storageRepository.writeKeyValue(_playerNameKey, playerName);

    notifyListeners();
  }
}

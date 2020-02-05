import 'dart:io';
import 'package:path_provider/path_provider.dart';

class StorageRepository {
  String playerKey = 'Wanderer';

  Future<String> get _localPath async {
    final directory = await getApplicationDocumentsDirectory();

    return directory.path;
  }

  Future<File> get _localFile async {
    final path = await _localPath;
    return File('$path/the_gauntlet_profile.txt');
  }

  Future<String> getFileContents() async {
    try {
      final file = await _localFile;
      bool fileExists = await file.exists();
      String contents = '';

      if (fileExists == true) {
        print('File exists');

        // Read the file.
        contents = await file.readAsString();
      }

      return contents;
    } catch (e) {
      // If encountering an error, return 0.
      return 'Error';
    }
  }

  Future<File> writeKeyValue(String key, String value) async {
    final file = await _localFile;

    String contents = await getFileContents();
    String existingValue = await readKeyValue(key);
    String newContents = '';

    if (existingValue != '') {
      newContents = contents.replaceAll(existingValue, value);
    } else {
      newContents = contents += '$key:$value,';
    }

    // Write the file.
    return file.writeAsString('$newContents');
  }

  Future<String> readKeyValue(String key) async {
    final contents = await getFileContents();

    String matchingValue = '';
    List<String> contentsSplit = contents.split(',');

    if (contentsSplit.length > 0) {
      String matchingItem = contentsSplit?.singleWhere((item) => item.contains(key), orElse: () => null);
      matchingValue = matchingItem?.replaceAll(key, '') ?? '';
    }

    print(matchingValue);

    return matchingValue;
  }

  Future<File> setPlayerName(String name) async {
    return await writeKeyValue(playerKey, name);
  }

  Future<String> getPlayerName() async {
    return await readKeyValue(playerKey);
  }
}
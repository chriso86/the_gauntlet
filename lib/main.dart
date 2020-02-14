import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:the_gauntlet/game/main_menu_widget.dart';
import 'package:the_gauntlet/user/user_profile.dart';

void main() => runApp(GauntletApp());

class GauntletApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'The Gauntlet',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => UserProfileNotifier())
        ],
        child: MainMenu(),
      ),
    );
  }
}

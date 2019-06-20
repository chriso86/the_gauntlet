import 'package:flutter/material.dart';
import 'package:the_gauntlet/user_profile.dart';
import 'main_menu.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      builder: (context, child) => new SafeArea(child: new UserProfile(child: child)),
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MainMenu()
    );
  }
}
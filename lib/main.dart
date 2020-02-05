import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:the_gauntlet/game/main_menu_widget.dart';
import 'package:the_gauntlet/storage/storage_bloc.dart';
import 'package:the_gauntlet/storage/storage_repository.dart';

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
        home: BlocProvider<StorageBloc>(
          create: (BuildContext context) => StorageBloc(StorageRepository()),
          child: MainMenu(),
        ));
  }
}

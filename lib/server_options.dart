import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:the_gauntlet/server_configuration.dart';
import 'category.dart';
import 'connectivity_monitor.dart';
import 'difficuly_level.dart';
import 'gateway.dart';
import 'loader.dart';

class ServerOptions extends StatefulWidget {
  @override
  _ServerOptionsState createState() => _ServerOptionsState();
}

class _ServerOptionsState extends State<ServerOptions> {
  final gateway = new Gateway();
  ServerConfiguration configuration = new ServerConfiguration('', '', '');
  List<Category> categories;
  List<DifficultyLevel> difficultyLevels = [
    new DifficultyLevel(1, 'Easy'),
    new DifficultyLevel(2, 'Medium'),
    new DifficultyLevel(3, 'Hard'),
  ];

  @override
  void initState() {
    setState(() {
      gateway.fetchCategories().then((response) {
        var parsedCategories = json.decode(response.body)['trivia_categories'];

        setState(() {
          categories = parsedCategories
              .map<Category>(
                  (category) => new Category(category['id'], category['name']))
              .toList();
        });
      });
    });

    super.initState();
  }

  void createServer() {
    print(configuration.category);
    print(configuration.questionCount);
    print(configuration.difficultyLevel);
    print(configuration.name);

    // gateway.getQuestions(configuration.questionCount, configuration.category);
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: <Widget>[
        Scaffold(
            appBar: AppBar(
              title: new Text('Create a new game'),
            ),
            body: Column(
              children: <Widget>[
                ListTile(
                  leading: Icon(Icons.label),
                  title: TextField(
                    decoration: InputDecoration(
                      hintText: 'Name of your game',
                    ),
                    onChanged: (name) {
                      configuration.name = name;
                    },
                  ),
                ),
                ListTile(
                  leading: Icon(Icons.category),
                  title: DropdownButton(
                      items: categories?.map((Category category) {
                            return new DropdownMenuItem<Category>(
                                value: category,
                                child: new Text(category.name));
                          })?.toList() ??
                          [],
                      onChanged: (category) {
                        configuration.category = category.toString();
                      },
                      hint: Text('Choose a category')),
                ),
                ListTile(
                  leading: Icon(Icons.settings),
                  title: DropdownButton(
                      items: difficultyLevels?.map((DifficultyLevel level) {
                            return new DropdownMenuItem<int>(
                                value: level.id, child: new Text(level.name));
                          })?.toList() ??
                          [],
                      onChanged: (difficultyLevel) {
                        setState(() {
                          configuration.difficultyLevel = difficultyLevel.toString();
                        });
                      },
                      value: difficultyLevels[0].id,
                      hint: Text('Choose your difficulty')),
                ),
                ListTile(
                  leading: Icon(Icons.label),
                  title: TextField(
                    keyboardType: TextInputType.numberWithOptions(),
                    decoration: InputDecoration(
                      hintText: 'How many questions?',
                    ),
                    onChanged: (questionCount) {
                      configuration.questionCount = questionCount;
                    },
                  ),
                ),
              ],
            ),
            floatingActionButton: FloatingActionButton(
                child: Icon(Icons.add),
                onPressed: () {
                  createServer();
                })),

        // No WIFI Message
        ConnectivityMonitor(),

        // Loader
        // Loader()
      ],
    );
  }
}

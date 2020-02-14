import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:the_gauntlet/connection/connectivity_monitor_widget.dart';
import 'package:the_gauntlet/server/model/server_configuration_model.dart';
import 'model/category_model.dart';
import 'model/difficuly_level_model.dart';
import '../storage/storage_repository.dart';
import 'server_repository.dart';
import '../loader/loader_widget.dart';

class ServerOptions extends StatefulWidget {
  @override
  _ServerOptionsState createState() => _ServerOptionsState();
}

class _ServerOptionsState extends State<ServerOptions> {
  // Persistent
  final gateway = new Gateway();
  final documentStorage = new StorageRepository();

  // Defaults
  static String _defaultDifficulty = 'Medium';
  static String _defaultName = 'The Great Battle';
  static String _defaultAmount = '10';

  // Output
  ServerConfiguration configuration;

  // Lists
  List<Category> categories;
  List<DifficultyLevel> difficultyLevels = [
    new DifficultyLevel(1, 'Easy'),
    new DifficultyLevel(2, 'Medium'),
    new DifficultyLevel(3, 'Hard'),
  ];
  List<Widget> playersList = List<Widget>();

  // Form bindings
  int _category;
  String _difficultyLevel = _defaultDifficulty;
  TextEditingController _nameController =
      new TextEditingController(text: _defaultName);
  TextEditingController _amountController =
      new TextEditingController(text: _defaultAmount);

  // State
  bool _loading = true;

  @override
  void initState() {
    playersList.add(
      Row(
        children: <Widget>[
          Text('')
        ],
      )
    );

    setState(() {
      gateway.fetchCategories().then((response) {
        var parsedCategories = json.decode(response.body)['trivia_categories'];

        // Register name and amount listeners
        _nameController.addListener(setNameOnConfiguration);
        _amountController.addListener(setAmountOnConfiguration);

        setState(() {
          categories = parsedCategories
              .map<Category>(
                  (category) => new Category(category['id'], category['name']))
              .toList();

          var defaultCategory = categories[0].id;

          _category = defaultCategory;

          // Set up initial state of configuration object
          configuration = new ServerConfiguration(_defaultName, defaultCategory,
              _defaultDifficulty, _defaultAmount);

          // Stop loading
          _loading = false;
        });
      });
    });

    super.initState();
  }

  void setNameOnConfiguration() {
    configuration.name = _nameController.text;
  }

  void setAmountOnConfiguration() {
    configuration.questionCount = _amountController.text;
  }

  void createServer() {
    gateway
        .getQuestions(configuration.questionCount, configuration.category,
            configuration.difficultyLevel)
        .then((response) {
      var parsedQuestions = json.decode(response.body)['results'];
    });
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
                  title: TextFormField(
                    decoration: InputDecoration(
                      hintText: 'E.g. The Pit of Sorrow',
                    ),
                    controller: _nameController,
                  ),
                  subtitle: Text('Name of your game'),
                ),
                ListTile(
                  leading: Icon(Icons.category),
                  title: DropdownButton(
                    items: categories?.map((Category category) {
                          return new DropdownMenuItem<int>(
                              value: category.id,
                              child: new Text(category.name));
                        })?.toList() ??
                        [],
                    onChanged: (category) {
                      setState(() {
                        _category = category;

                        configuration.category = category;
                      });
                    },
                    isExpanded: true,
                    value: _category,
                    hint: Text('E.g. Science: Computers'),
                  ),
                  subtitle: Text('Choose a category'),
                ),
                ListTile(
                  leading: Icon(Icons.settings),
                  title: DropdownButton(
                      items: difficultyLevels?.map((DifficultyLevel level) {
                            return new DropdownMenuItem<String>(
                                value: level.name, child: new Text(level.name));
                          })?.toList() ??
                          [],
                      onChanged: (difficultyLevel) {
                        setState(() {
                          _difficultyLevel = difficultyLevel;

                          configuration.difficultyLevel = difficultyLevel;
                        });
                      },
                      isExpanded: true,
                      value: _difficultyLevel,
                      hint: Text('E.g. Medium')),
                  subtitle: Text('Choose your difficulty'),
                ),
                ListTile(
                  leading: Icon(Icons.view_list),
                  title: TextFormField(
                    keyboardType: TextInputType.numberWithOptions(),
                    decoration: InputDecoration(
                      hintText: 'E.g. 20',
                    ),
                    controller: _amountController,
                  ),
                  subtitle: Text('Number of questions'),
                ),
                Container(
                  width: MediaQuery.of(context).size.width,
                  margin: const EdgeInsets.only(top: 10.0),
                  padding: const EdgeInsets.all(10.0),
                  decoration: new BoxDecoration(
                      border: Border(
                          bottom: BorderSide(color: Colors.grey, width: 1.0))),
                  child: new Text('Players',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 16.0,
                      )),
                ),

                Column(
                  children: playersList,
                )

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
        Visibility(
          visible: _loading,
          child: Loader(),
        )
      ],
    );
  }
}

import 'package:flutter/material.dart';

class Loader extends StatefulWidget {
  @override
  _LoaderState createState() => _LoaderState();
}

class _LoaderState extends State<Loader> {
  int loaderCount = 0;

  @override
  void initState() {
    super.initState();
  }

  @override void dispose() {
    loaderCount = 0;

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black,
      width: MediaQuery.of(context).size.width,
      height: MediaQuery.of(context).size.height,
      child: Center(
        child: Text('Loading', style: TextStyle(color: Colors.blue, fontSize: 36, decorationColor: Colors.black)),
      ),
    );
  }
}

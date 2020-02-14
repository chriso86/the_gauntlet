import 'package:flutter/material.dart';

class Loader extends StatefulWidget {
  @override
  _LoaderState createState() => _LoaderState();
}

class _LoaderState extends State<Loader> {
  @override
  Widget build(BuildContext context) {
    return AlignTransition(
      alignment: ,
      child: Container(
        width: MediaQuery.of(context).size.width,
        height: MediaQuery.of(context).size.height,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage("images/background.jpg"),
            fit: BoxFit.cover,
          ),
        ),
        child: AnimatedContainer(
          width: 200,
          height: 200,
          duration: Duration(seconds: 1),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Container(
                width: 400,
                height: 500,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage("images/signpost.png"),
                    fit: BoxFit.cover,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    SizedBox(height: 250),
                    Text('Loading',
                        style: TextStyle(
                          decoration: TextDecoration.none,
                          color: Colors.white,
                          fontFamily: 'Primer',
                          fontSize: 36,
                        )),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

import 'category.dart';
import 'package:http/http.dart' as http;

class Gateway {
  Future<http.Response> fetchCategories() {
    return http.get('https://opentdb.com/api_category.php');
  }

  Future<http.Response> getQuestions(int amount, int category) async {
    var url = 'https://opentdb.com/api_count.php?amount=' +
        amount.toString() +
        '&category=' +
        category.toString();

    return await http.get(url);
  }
}

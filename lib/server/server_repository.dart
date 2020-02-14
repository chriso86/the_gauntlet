import 'model/category_model.dart';
import 'package:http/http.dart' as http;

class Gateway {
  Future<http.Response> fetchCategories() {
    return http.get('https://opentdb.com/api_category.php');
  }

  Future<http.Response> getQuestions(
      String amount, int category, String difficulty) async {
    var url = 'https://opentdb.com/api.php?amount=' + amount;

    if (category != null) {
      url += '&category=' + category.toString();
    }

    if (difficulty != null) {
      url += '&difficulty=' + difficulty.toLowerCase();
    }

    return await http.get(url);
  }
}

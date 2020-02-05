import 'package:equatable/equatable.dart';

abstract class StorageEvent extends Equatable {
  const StorageEvent();
}

class GetPlayerName extends StorageEvent {
  const GetPlayerName();

  @override
  List<Object> get props => null;
}
import 'package:equatable/equatable.dart';
import 'package:the_gauntlet/storage/storage_repository.dart';

abstract class StorageState extends Equatable{
  const StorageState();
}

class StorageInitial extends StorageState {
  const StorageInitial();

  @override
  List<Object> get props => [];
}

class StorageLoading extends StorageState {
  const StorageLoading();

  @override
  List<Object> get props => [];
}

class StorageLoadedName extends StorageState {
  final String name;

  const StorageLoadedName(this.name);

  @override
  List<Object> get props => [name];
}

class StorageError extends StorageState {
  final String message;

  const StorageError(this.message);

  @override
  List<Object> get props => [message];
}
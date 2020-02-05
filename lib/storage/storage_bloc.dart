import 'package:bloc/bloc.dart';
import 'package:the_gauntlet/storage/storage_event.dart';
import 'package:the_gauntlet/storage/storage_repository.dart';
import 'package:the_gauntlet/storage/storage_state.dart';
import 'package:the_gauntlet/connection/network_error.dart';

class StorageBloc extends Bloc<StorageEvent, StorageState> {
  final StorageRepository storageRepository;

  StorageBloc(this.storageRepository);

  @override
  get initialState => StorageInitial();

  @override
  Stream<StorageState> mapEventToState(StorageEvent event) async* {
    yield StorageLoading();

    if (event is GetPlayerName) {
      try {
        final name = await storageRepository.getPlayerName();

        yield StorageLoadedName(name);
      } on NetworkError {
        yield StorageError('Could not load player name.');
      }
    }
  }
}

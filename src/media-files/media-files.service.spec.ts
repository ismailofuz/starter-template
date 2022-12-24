import { Test, TestingModule } from '@nestjs/testing';
import { MediaFilesRepository } from '../repository/classes/media-files';
import { MediaFilesService } from './media-files.service';

describe('MediaFilesService', () => {
    let service: MediaFilesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MediaFilesService,
                { provide: MediaFilesRepository, useValue: {} },
            ],
        }).compile();

        service = module.get<MediaFilesService>(MediaFilesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

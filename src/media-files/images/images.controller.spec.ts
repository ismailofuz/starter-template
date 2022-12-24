import { Test, TestingModule } from '@nestjs/testing';
import { MediaFilesService } from '../media-files.service';
import { ImagesController } from './images.controller';

describe('ImagesController', () => {
    let controller: ImagesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ImagesController],
            providers: [{ provide: MediaFilesService, useValue: {} }],
        }).compile();

        controller = module.get<ImagesController>(ImagesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});

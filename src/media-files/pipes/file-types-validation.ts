import { FileValidator } from '@nestjs/common';

type FileTypesValidationOptions = {
    types: string[];
};

export class FileTypesValidation extends FileValidator<FileTypesValidationOptions> {
    protected validationOptions: FileTypesValidationOptions;

    constructor(options: FileTypesValidationOptions) {
        super(options);
        this.validationOptions = options;
    }

    isValid(file?: any): boolean | Promise<boolean> {
        if (!this.validationOptions) {
            return false;
        }

        if (!file.mimetype) {
            return false;
        }

        return this.validationOptions.types.includes(file.mimetype);
    }

    buildErrorMessage(): string {
        return `Validation failed (expected type is one of ${this.validationOptions.types.join(
            ' ',
        )})`;
    }
}

import {IAuditable} from "../../global/interfaces/auditable.interface";
import {ApprovalModel} from "../../global/models/approval.model";
import {UserModel} from "../../users/models/user.model";
import {LoggerService} from "../../global/services/logger.service";
import {DifficultyEnum} from "../enums/difficulty.enum";

export class QuestionModel implements IAuditable {
    // QuestionModel properties
    _id: string = '';
    categoryId: string;
    question: string;
    difficulty: DifficultyEnum = DifficultyEnum.Easy;
    possibleAnswers: string[] = [];
    correctAnswer: string = '';

    // ApprovalModel
    approval: ApprovalModel = new ApprovalModel();

    // Auditable
    createdBy: string = '';
    createdOn: Date = new Date();
    updatedBy: string = '';
    updatedOn: Date = new Date();

    private _loggerService: LoggerService = new LoggerService();


    constructor(
        id: string,
        question: string,
        categoryId: string,
        difficulty: DifficultyEnum = DifficultyEnum.Easy,
        possibleAnswers: string[] = [],
        correctAnswer: string = ''
    ) {
        if (!question) {
            throw new Error('No question was provided, you can\'t create a question without a question!');
        }

        if(!categoryId) {
            throw new Error('No category ID was provided for the question');
        }

        // New QuestionModel
        this.question = question;
        this.categoryId = categoryId;
        this.difficulty = difficulty;

        if (possibleAnswers.length) {
            this.setPossibleAnswers(possibleAnswers);
        }

        if (correctAnswer) {
            this.correctAnswer = correctAnswer;
        }
    }


    // QuestionModel methods
    isCorrectAnswer(answer: string): boolean {
        return this.possibleAnswers.indexOf(answer) > -1 && this.correctAnswer === answer;
    }

    setPossibleAnswers(possibleAnswers: string[] = []) {
        if (possibleAnswers.length < 4) {
            throw new Error('You cannot add a question without providing 4 possible answers');
        }

        // Parse possible answers array from stringified JSON (if applicable), or just assign array
        if (Array.isArray(possibleAnswers)) {
            this.possibleAnswers = possibleAnswers;
        } else {
            try {
                this.possibleAnswers = JSON.parse(possibleAnswers);
            } catch (e) {
                throw new Error(e);
            }
        }
    }

    setCorrectAnswer(answer: string) {
        if (!answer) {
            throw new Error('No answer was provided as a correct answer');
        }

        this.correctAnswer = answer;
    }

    update(modifiedQuestion: QuestionModel, modifiedBy: UserModel) {
        if (!modifiedQuestion) {
            throw new Error('There is no modified question available to update this question');
        }

        if (!modifiedBy) {
            throw new Error('There is no user present that is responsible for this change');
        }

        // Update this question
        this.question = modifiedQuestion.question;
        this.setPossibleAnswers(modifiedQuestion.possibleAnswers);

        this.modifyUpdated(modifiedBy._id);
    }


    // Approvals
    setRequested(requestedBy: string, requestedOn: Date) {
        if (!requestedBy) {
            throw new Error('Request status cannot be updated because the requester is empty');
        }

        if (!requestedOn) {
            throw new Error('Request date cannot be updated because the date is empty');
        }

        this.approval.requestedBy = requestedBy;
        this.approval.requestedOn = requestedOn;
    }

    setApproved(approvedBy: string, approvedOn: Date) {
        if (!approvedBy) {
            throw new Error('Approved status cannot be updated because the approver is empty');
        }

        if (!approvedOn) {
            throw new Error('Approved date cannot be updated because the date is empty');
        }

        this.approval.approvedBy = approvedBy;
        this.approval.approvedOn = approvedOn;
    }


    // Auditable
    modifyCreated(createdBy: string) {
        this.createdBy = createdBy || 'System';
        this.createdOn = new Date();

        this._loggerService.logEvent('Created QuestionModel', this.createdBy);
    }

    modifyUpdated(updatedBy: string) {
        this.updatedBy = updatedBy || 'System';
        this.updatedOn = new Date();

        this._loggerService.logEvent('Created QuestionModel', this.updatedBy);
    }
}

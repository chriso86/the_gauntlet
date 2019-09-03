import {IAuditable} from "../../global/interfaces/auditable.interface";
import {user} from "firebase-functions/lib/providers/auth";

export class QuizModel implements IAuditable{
    _id: string = 'NA';
    name: string;
    hostedBy: string;
    hostedOn: Date;
    categoryIds: string[];
    participantIds: string[] = [];
    numberOfQuestions: number;
    closed: boolean;
    createdOn: Date;
    createdBy: string;
    updatedOn: Date;
    updatedBy: string;

    constructor(
        id: string,
        name: string,
        categoryIds: string[],
        numberOfQuestions: number = 10,
        hostedBy: string = 'NA',
        hostedOn: Date = new Date(),
        participantIds: string[] = [],
        closed: boolean = false,
        createdOn: Date = new Date(),
        createdBy: string = 'System',
        updatedOn: Date = new Date(),
        updatedBy: string = 'System'
    ) {
        this._id = id;
        this.name = name;
        this.categoryIds = categoryIds;
        this.hostedBy = hostedBy;
        this.hostedOn = hostedOn;
        this.participantIds = participantIds;
        this.numberOfQuestions = numberOfQuestions;
        this.closed = closed;
        this.createdOn = createdOn;
        this.createdBy = createdBy;
        this.updatedOn = updatedOn;
        this.updatedBy = updatedBy;
    }

    setHost(userId: string): void {
        if (!userId) {
            throw new Error('The host of the quiz cannot be set to null');
        }

        this.hostedBy = userId;
    }

    addParticipant(userId: string): void {
        if (!userId) {
            throw new Error('No userId specified for the participant to add');
        }

        this.participantIds.push(userId);
    }

    removeParticipant(userId: string): void {
        if (!user) {
            throw new Error('No userId specified to remove a participant');
        }

        const index = this.participantIds.findIndex(participantId => participantId === userId);

        if (index > -1) {
            this.participantIds.splice(index, 1);
        }
    }

    closeQuiz(): void {
        this.closed = true;
    }

    modifyCreated(createdBy?: string | undefined): void {
        this.createdBy = createdBy || 'System';
        this.createdOn = new Date();
    }
    modifyUpdated(updatedBy?: string | undefined): void {
        this.updatedBy = updatedBy || 'System';
        this.updatedOn = new Date();
    }
}

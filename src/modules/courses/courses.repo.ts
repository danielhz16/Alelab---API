import { mainRepo } from "src/db/db.repo";
import { BaseRepository } from "mrepo-sql";
import { Injectable } from "@nestjs/common";
import { CreateCourse, Course } from "./ts";
import { Options } from "@shared";

@Injectable()
export class CoursesRepository {
    private bd: BaseRepository;

    constructor() {
        this.bd = mainRepo;
    }

    async createCourse(params: CreateCourse): Promise<Course> {
        return await this.bd.execSP('SP_Courses_Create', {
            params,
            out: [{ name: 'id' }, { name: 'createdAt' }]
        });
    };

    async getAllCourses(status: number): Promise<Course[]> {
        return await this.bd.execSP('SP_Courses_list', {
            params: [status],
            plain: false
        });
    }


    async getOptionsCourses(): Promise<Options[]> {
        return await this.bd.view('VW_Courses_Options');
    }
}   

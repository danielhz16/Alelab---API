import { CoursesRepository } from "./courses.repo";
import { Injectable } from "@nestjs/common";
import { CreateCourseInput, Course } from "./ts";
import { ResponseRefresh } from "@shared";

@Injectable()
export class CoursesService {
    constructor(
        private readonly coursesRepo: CoursesRepository
    ) { }

    async createCourse(course: CreateCourseInput): Promise<ResponseRefresh> {
        const { name, description, teacher } = course;
        const { id, createdAt } = await this.coursesRepo.createCourse([name, description, teacher]);
        return {
            newData: { id, createdAt, ...course }
        }
    }

    async getAllCourses(status: number): Promise<Course[]> {
        const courses = await this.coursesRepo.getAllCourses(status);
        return courses;
    }

    async getOptionsCourses(): Promise<{ label: string; id: number }[]> {
        const options = await this.coursesRepo.getOptionsCourses();
        return options;
    }
}
import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import type { CreateCourseInput } from "./ts";

@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService
    ) {}

    @Post('create')
    async createCourse(@Body() course: CreateCourseInput) {
        return this.coursesService.createCourse(course);
    }

    @Get('all')
    async getAllCourses(@Query('status') status: number) {
        return this.coursesService.getAllCourses(status);
    }
    @Get('options')
    async getOptionsCourses() {
        return this.coursesService.getOptionsCourses();
    }
}

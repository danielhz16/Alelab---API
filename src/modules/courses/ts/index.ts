export interface Course {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    teacher: string;
}

export interface CreateCourseInput {
    name: string;
    description: string;
    teacher: string;
}

export type CreateCourse = [
   CreateCourseInput["name"],
   CreateCourseInput["description"],
   CreateCourseInput["teacher"]
]
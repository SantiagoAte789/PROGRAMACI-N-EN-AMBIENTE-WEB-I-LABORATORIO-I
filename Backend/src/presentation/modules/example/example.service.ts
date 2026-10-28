import { pool } from "../../../config/database";
import { EnrollmentExample, CourseExample, StudentExample } from "../../../domain/interfaces/example.interface";

export class ExampleService {

  public async getAllStudentsExample(): Promise<StudentExample[]> {
    const sql = `SELECT * FROM students_example;`;
    const result = await pool.query(sql);
    return result.rows;
  }

  public async getAllCoursesExample(): Promise<CourseExample[]> {
    const sql = `SELECT * FROM  courses_example;`;
    const result = await pool.query(sql);
    return result.rows;
  }

  public async getAllEnrollmentsExample(): Promise<EnrollmentExample[]> {
    const sql = `SELECT * FROM enrollments_example;`;
    const result = await pool.query(sql);
    return result.rows;
  }

  public async getAllFull(): Promise<EnrollmentExample[]> {
    const sql = `SELECT * FROM students_example s 
      INNER JOIN enrollments_example e ON s.id = e.estudiante_id 
      INNER JOIN courses_example c ON c.id = e.curso_id;`;
    const result = await pool.query(sql);
    return result.rows;
  }

}

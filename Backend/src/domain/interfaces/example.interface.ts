export interface StudentExample {
  id: number;
  nombre: string;
  correo: string;
}

export interface CourseExample {
  id: number;
  nombre: string;
  creditos: number;
}

export interface EnrollmentExample {
  id: number;
  estudiante_id: number;
  curso_id: number;
  fecha_matricula: Date;
  nota_final: number | null;
}
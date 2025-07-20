export interface Certificate {
  id?: string;
  issuer: string;
  title: string;
  year: string;
}

export interface Education {
  id?: string;
  school: string;
  degree: string;
  year: string;
}

export interface Experience {
  id?: string;
  company: string;
  location: string;
  period: string;
  role: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
}

declare interface Project {
  id: string;
  slug: string;
  title: { [key: string]: string };
  description: { [key:string]: string };
  techStack: string[];
  imageUrl: string;
}
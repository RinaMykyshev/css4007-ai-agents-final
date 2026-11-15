import {readFileSync} from 'node:fs';
const COURSES = JSON.parse(readFileSync(new URL('../data/courses.json', import.meta.url),'utf8'));
export const toolDefinitions = [
 {type:'function',function:{name:'get_course_info',description:'Look up course title and credits by course ID from the local sample catalog.',parameters:{type:'object',properties:{course_id:{type:'string',description:'Course ID, e.g. AI101'}},required:['course_id'],additionalProperties:false}}},
 {type:'function',function:{name:'get_course_deadlines',description:'Find recorded task names and due dates for a course in the local sample catalog.',parameters:{type:'object',properties:{course_id:{type:'string',description:'Course ID, e.g. AI101'}},required:['course_id'],additionalProperties:false}}}
];
export function executeTool(name, args) {
 if(!['get_course_info','get_course_deadlines'].includes(name)) throw new Error('Unknown tool');
 if(!args || typeof args !== 'object' || Array.isArray(args) || Object.keys(args).some(k=>k!=='course_id') || typeof args.course_id!=='string' || !/^[A-Z]{2,5}[0-9]{3}$/.test(args.course_id)) throw new Error('Invalid course_id or arguments');
 const course=COURSES[args.course_id];
 if(!course) return {error:'Course not found in sample catalog',course_id:args.course_id};
 if(name==='get_course_info') return {course_id:args.course_id,title:course.title,credits:course.credits};
 return {course_id:args.course_id,deadlines:course.deadlines};
}

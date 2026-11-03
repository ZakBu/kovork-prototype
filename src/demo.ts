import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export type Project = { id:string; name:string; description:string; territory:string; status:string; progress:number; members:number; updated:string; pinned?:boolean };
export type Task = { id:string; projectId:string; title:string; description:string; status:string; priority:string; assignee:string; due:string };
export type Dashboard = { id:string; name:string; description:string; theme:string; audience:string; period:string; sources:string[]; published:boolean; updated:string };
export type Message = { id:string; role:'user'|'assistant'; text:string; kind?:string };
export type Chat = { id:string; title:string; messages:Message[]; pinned?:boolean };
const initialProjects:Project[] = [
{id:'zil',name:'Развитие территории «ЗИЛ-Юг»',description:'Комплексное развитие территории ЗИЛ-Юг с использованием данных, документов и AI-ассистента.',territory:'ЗИЛ-Юг, Москва',status:'Активный',progress:67,members:8,updated:'18 мин назад'},
{id:'kalibr',name:'Реновация промзоны «Калибр»',description:'Преобразование промышленной территории в новый городской квартал.',territory:'Москва',status:'Активный',progress:42,members:5,updated:'2 ч назад'},
{id:'transport',name:'Транспортная доступность районов',description:'Анализ связности городской территории.',territory:'Москва',status:'Активный',progress:78,members:6,updated:'5 ч назад'},
{id:'nagatino',name:'КРТ «Нагатино»',description:'Концепция комплексного развития территории.',territory:'Москва',status:'Черновик',progress:15,members:4,updated:'Вчера'},
{id:'social',name:'Анализ социальной инфраструктуры',description:'Оценка обеспеченности жителей объектами инфраструктуры.',territory:'Москва',status:'Пауза',progress:36,members:2,updated:'3 дня назад'},
{id:'embankment',name:'Реконструкция набережной',description:'Развитие общественных пространств.',territory:'Санкт-Петербург',status:'На согласовании',progress:84,members:5,updated:'Вчера'},
{id:'metro',name:'Транспортная схема метрополитена',description:'Перспективная схема развития транспорта.',territory:'Казань',status:'Завершён',progress:100,members:7,updated:'5 дней назад'},
{id:'heritage',name:'Реставрация исторического квартала',description:'Сохранение культурного наследия.',territory:'Нижний Новгород',status:'В работе',progress:52,members:4,updated:'Сегодня'}];
const initialTasks:Task[] = ['Проверить соответствие генплану','Пересчитать транспортную нагрузку','Подготовить исходные данные по плотности','Доклад для руководства','Собрать обратную связь по генплану','Провести встречу с заказчиком','Обновить раздел 3 доклада','Проверить сценарии застройки','План мероприятий по развитию территории','Запросить данные по ЖКХ и инженерии','Подготовить отчёт по рискам','Подготовить визуализации сценариев','Аналитическая записка по транспорту','Концепция благоустройства набережной','Анализ текущей ситуации'].map((title,i)=>({id:'task-'+i,projectId:'zil',title,description:['Уточнить параметры проекта','Обновление исходных данных и сроков','Свод данных из Мос.Даты и ЦД'][i%3],status:['Не начата','В работе','На проверке','На согласовании','Завершена'][i%5],priority:['Средний','Высокий','Низкий'][i%3],assignee:['Мария Смирнова','Дмитрий Волков','Алексей Иванов'][i%3],due:'2026-11-'+String(5+i).padStart(2,'0')}));
const initialDashboards:Dashboard[]=[{id:'waste',name:'Мониторинг вывоза отходов',description:'Оперативный дашборд по вывозу отходов за 7 дней',theme:'dark',audience:'Руководитель',period:'7 дней',sources:['Цифровой двойник Москвы','Мос.Дата'],published:true,updated:'Сегодня'},{id:'education',name:'Контроль качества образования',description:'Рейтинг образовательных организаций',theme:'light',audience:'Аналитик',period:'30 дней',sources:['Мос.Дата'],published:true,updated:'Вчера'},{id:'kpi',name:'Аналитика KPI',description:'План/факт и ключевые показатели',theme:'light',audience:'Руководитель',period:'7 дней',sources:['Внутренние системы'],published:false,updated:'Вчера'},{id:'resources',name:'Ресурсная загруженность',description:'Загрузка транспорта и объектов перевозки по времени',theme:'dark',audience:'Диспетчер',period:'7 дней',sources:['Мос.Дата'],published:true,updated:'2 дня назад'}];
export interface DemoState { projects:Project[];tasks:Task[];dashboards:Dashboard[];chats:Chat[]; role:string;objectives:string[];onboarded:boolean;collapsed:boolean;
setProfile:(role:string,objectives:string[])=>void;setCollapsed:(v:boolean)=>void;
addProject:(p:Project)=>void;updateProject:(id:string,p:Partial<Project>)=>void;
addTask:(t:Task)=>void;updateTask:(id:string,t:Partial<Task>)=>void;
saveDashboard:(d:Dashboard)=>void;addChat:(c:Chat)=>void;updateChat:(id:string,messages:Message[])=>void;updateChatMeta:(id:string,patch:Partial<Pick<Chat,'title'|'pinned'>>)=>void;reset:()=>void; }
export const useDemo=create<DemoState>()(persist((set)=>({projects:initialProjects,tasks:initialTasks,dashboards:initialDashboards,chats:[],role:'Руководитель',objectives:[],onboarded:false,collapsed:false,
setProfile:(role,objectives)=>set({role,objectives,onboarded:true}),setCollapsed:(collapsed)=>set({collapsed}),
addProject:p=>set(s=>({projects:[p,...s.projects]})),updateProject:(id,p)=>set(s=>({projects:s.projects.map(x=>x.id===id?{...x,...p}:x)})),
addTask:t=>set(s=>({tasks:[t,...s.tasks]})),updateTask:(id,t)=>set(s=>({tasks:s.tasks.map(x=>x.id===id?{...x,...t}:x)})),
saveDashboard:d=>set(s=>({dashboards:s.dashboards.some(x=>x.id===d.id)?s.dashboards.map(x=>x.id===d.id?d:x):[d,...s.dashboards]})),
addChat:c=>set(s=>({chats:[c,...s.chats]})),updateChat:(id,messages)=>set(s=>({chats:s.chats.map(c=>c.id===id?{...c,messages}:c)})),
updateChatMeta:(id,patch)=>set(s=>({chats:s.chats.map(c=>c.id===id?{...c,...patch}:c)})),
reset:()=>{localStorage.removeItem('lab-cd-wizard');set({projects:initialProjects,tasks:initialTasks,dashboards:initialDashboards,chats:[],role:'Руководитель',objectives:[],onboarded:false,collapsed:false});}
}),{name:'lab-cd-demo-v1',version:1}));
export const uid=()=>crypto.randomUUID();
export const asset=(name:string)=>`${import.meta.env.BASE_URL}assets/${name}`;
export function downloadText(name:string,text:string,type='text/plain;charset=utf-8'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

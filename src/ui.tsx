import { useEffect, type ReactNode } from 'react';
import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
export { Button } from './coss/components/button';
export { Input } from './coss/components/input';
export { Card } from './coss/components/card';
export function Panel({children,className='',title,action}:{children:ReactNode;className?:string;title?:ReactNode;action?:ReactNode}){return <section className={'panel '+className}>{(title||action)&&<div className="panel-heading"><h3>{title}</h3>{action}</div>}{children}</section>}
export function Badge({children,tone='pink'}:{children:ReactNode;tone?:string}){return <span className={'badge badge-'+tone}>{children}</span>}
export function Modal({open,onClose,title,children,wide=false}:{open:boolean;onClose:()=>void;title:string;children:ReactNode;wide?:boolean}){return <Dialog.Root open={open} onOpenChange={v=>{if(!v)onClose()}}><Dialog.Portal><Dialog.Backdrop className="modal-backdrop"/><Dialog.Popup className={'modal '+(wide?'modal-wide':'')}><div className="modal-heading"><Dialog.Title>{title}</Dialog.Title><Dialog.Close className="icon-btn" aria-label="Закрыть"><X size={19}/></Dialog.Close></div>{children}</Dialog.Popup></Dialog.Portal></Dialog.Root>}
export function Empty({title='Пока ничего нет',description='Добавьте первый элемент, чтобы начать работу',action}:{title?:string;description?:string;action?:ReactNode}){return <div className="empty-state"><div className="empty-symbol">✧</div><h3>{title}</h3><p>{description}</p>{action}</div>}
export function toast(message:string){window.dispatchEvent(new CustomEvent('lab-toast',{detail:message}));}
export function useDocumentTitle(title:string){useEffect(()=>{document.title=title+' — Коворк'},[title]);}

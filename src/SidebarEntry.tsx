import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu } from '@base-ui/react/menu';
import { MoreHorizontal, Pencil, Pin, PinOff, Trash2 } from 'lucide-react';
import { useDemo } from './demo';
import { Modal, toast } from './ui';

export type SidebarItem = {id:string;title:string;to:string;pinned?:boolean};

export function SidebarEntry({item,kind}:{item:SidebarItem;kind:'project'|'chat'}) {
  const location=useLocation();
  const navigate=useNavigate();
  const deleteProject=useDemo(s=>s.deleteProject);
  const deleteChat=useDemo(s=>s.deleteChat);
  const updateProject=useDemo(s=>s.updateProject);
  const updateChatMeta=useDemo(s=>s.updateChatMeta);
  const [menuOpen,setMenuOpen]=useState(false);
  const [renaming,setRenaming]=useState(false);
  const [deleting,setDeleting]=useState(false);
  const [draft,setDraft]=useState(item.title);
  const active=location.pathname===item.to||location.pathname.startsWith(item.to+'/');
  const label=kind==='project'?'проектом':'чатом';

  function pin() {
    if(kind==='project')updateProject(item.id,{pinned:!item.pinned});
    else updateChatMeta(item.id,{pinned:!item.pinned});
    toast(item.pinned?'Пункт откреплён':'Пункт закреплён');
  }

  function remove() {
    if(kind==='project')deleteProject(item.id);else deleteChat(item.id);
    if(active)navigate(kind==='project'?'/projects':'/chat');
    setDeleting(false);
    toast(kind==='project'?'Проект удалён':'Чат удалён');
  }

  function rename() {
    const title=draft.trim();
    if(!title)return;
    if(kind==='project')updateProject(item.id,{name:title,updated:'Только что'});
    else updateChatMeta(item.id,{title});
    setRenaming(false);
    toast('Название сохранено');
  }

  return <div className={'nav-child-row'+(active?' is-active':'')+(menuOpen?' has-menu':'')}>
    <NavLink to={item.to} className={'nav-child'+(active?' nav-child-active':'')} title={item.title}>
      {item.pinned&&<Pin size={12} className="nav-pin" aria-label="Закреплено"/>}
      <span className="nav-child-label">{item.title}</span>
    </NavLink>
    <Menu.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <Menu.Trigger className="nav-child-more icon-btn" aria-label={'Управление '+label+': '+item.title} title="Управление">
        <MoreHorizontal size={16}/>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner side="bottom" align="end" sideOffset={6} className="sidebar-menu-positioner">
          <Menu.Popup className="sidebar-item-menu">
            <Menu.Item className="sidebar-menu-item" onClick={()=>{setDraft(item.title);setRenaming(true)}}><Pencil size={15}/>Переименовать</Menu.Item>
            <Menu.Item className="sidebar-menu-item" onClick={pin}>{item.pinned?<PinOff size={15}/>:<Pin size={15}/>} {item.pinned?'Открепить':'Закрепить'}</Menu.Item>
            <Menu.Item className="sidebar-menu-item sidebar-menu-danger" onClick={()=>setDeleting(true)}><Trash2 size={15}/>Удалить</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <Modal open={renaming} onClose={()=>setRenaming(false)} title={kind==='project'?'Переименовать проект':'Переименовать чат'}>
      <form onSubmit={e=>{e.preventDefault();rename()}}>
        <label className="field">Название<input autoFocus required maxLength={120} value={draft} onChange={e=>setDraft(e.target.value)}/></label>
        <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setRenaming(false)}>Отмена</button><button type="submit" className="btn btn-primary" disabled={!draft.trim()}>Сохранить</button></div>
      </form>
    </Modal>
    <Modal open={deleting} onClose={()=>setDeleting(false)} title={kind==='project'?'Удалить проект?':'Удалить чат?'}>
      <p className="muted">«{item.title}» будет удалён из этого браузера{kind==='project'?' вместе с задачами проекта':''}.</p>
      <div className="modal-actions"><button type="button" className="btn btn-secondary" onClick={()=>setDeleting(false)}>Отмена</button><button type="button" className="btn btn-destructive" onClick={remove}>Удалить</button></div>
    </Modal>
  </div>;
}

                const signupform=document.getElementById('signupform');
                const loginform=document.getElementById('loginform');
                const todosection=document.getElementById('todosection');
                const admin=document.getElementById('admin');
                const changepass=document.getElementById('changepass');


                const gologin=document.getElementById('gologin');
                const gosignup=document.getElementById('gosignup');
                
                const signupbtn=document.getElementById('signupbtn');
                const signupmsg=document.getElementById('signupmsg');
                const sname=document.getElementById('sname');
                const semail=document.getElementById('semail');
                const spassword=document.getElementById('spassword');

                const allbtn=document.getElementById('all');
                const completedbtn=document.getElementById('completed');
                const pendingbtn=document.getElementById('pending');
                const markall=document.getElementById('markall');
                const removemark=document.getElementById('removemarkall');

                const lemail=document.getElementById('lemail');
                const lpassword=document.getElementById('lpassword');
                const loginbtn=document.getElementById('loginbtn');
                const loginmsg=document.getElementById('loginmsg');
                const welcometxt=document.getElementById('welcometxt');

                const todoinput=document.getElementById('todoinput');
                const todobtn=document.getElementById('todobtn');
                const todolist=document.getElementById('todolist');

                const logoutbtn=document.getElementById('logoutbtn');
                const resetbtn=document.getElementById('resetbtn');

                const admintxt=document.getElementById('admintxt');
                const logoutadmin=document.getElementById('logoutadmin');
                const adminlist=document.getElementById('adminlist');
                const searchinput=document.getElementById('search');

                const oldpass=document.getElementById('oldpass');
                const newpass=document.getElementById('newpass');
                const confirmpass=document.getElementById('confirmpass');
                const passmsg=document.getElementById('passmsg');
                const changepassbtn=document.getElementById('changepassbtn');
                const passlist=document.getElementById('passlist');

                const femail=document.getElementById('femail');
                const npassword=document.getElementById('npassword');
                const cpassword=document.getElementById('cpassword');
                const fpasswordbtn=document.getElementById('forgotpassbtn');
                const fpassword=document.getElementById('fpassword');
                const fmsg=document.getElementById('fmsg');
                const forgot=document.getElementById('goforgotpass');
                const backlogin=document.getElementById('back');

                let users=JSON.parse(localStorage.getItem('users'))||[];
                let currentUser=JSON.parse(localStorage.getItem('currentUser'));
                let isLoggedIn=localStorage.getItem('isLoggedIn')==='true';
                let currentfilter='all';

                if(isLoggedIn && currentUser){
                    if(currentUser.role==='admin'){
                        showadmin();
                    }else{
                        showtodo();
                    }
                }else{
                    showsignup();
                }
                

                gologin.addEventListener('click',(e)=>{
                    e.preventDefault();
                    showlogin();
                });
                gosignup.addEventListener('click',(e)=>{
                    e.preventDefault();
                    showsignup();
                });
                backlogin.addEventListener('click',(e)=>{
                    e.preventDefault();
                    showlogin();
                });
                forgot.addEventListener('click',(e)=>{
                    e.preventDefault();
                    showforgotpass();
                });
                allbtn.addEventListener('click',(e)=>{
                    currentfilter='all';
                    rendertodo();
                });
                completedbtn.addEventListener('click',(e)=>{
                    currentfilter='completed';
                    rendertodo();
                });
                pendingbtn.addEventListener('click',(e)=>{
                    currentfilter='pending';
                    rendertodo();
                });

                signupbtn.addEventListener('click',()=>{
                    const name=sname.value.trim();
                    const email=semail.value.trim();
                    const password=spassword.value.trim();

                    if(!name || !email || !password){
                        signupmsg.innerText='all feilds are required';
                        return;
                    };

                    const userexist=users.find(u=>u.email===email);

                    if(userexist){
                        signupmsg.innerText='user al ready exists';
                        return;
                    };

                    const isfirstuser=users.length===0;


                    const newuser={
                        name,
                        email,
                        password,
                        todos:[],
                        role:isfirstuser ?'admin':'user',
                        date:new Date().toISOString(),
                    };
                    users.push(newuser);
                    currentUser=newuser;

                    sname.value='';
                    semail.value='';
                    spassword.value='';

                    localStorage.setItem('currentUser',JSON.stringify(currentUser));
                    localStorage.setItem('users',JSON.stringify(users));
                    localStorage.setItem('isLoggedIn','true');

                    if(currentUser.role==='admin'){
                        showadmin();
                    }else{
                        showtodo();
                    }
                });

                loginbtn.addEventListener('click',()=>{
                    const email=lemail.value.trim();
                    const password=lpassword.value.trim();

                    if(!email || !password){
                        loginmsg.innerText='all feilds are required';
                        return;
                    };

                    const user=users.find(u=>u.email===email && u.password===password);

                    if(!user){
                        loginmsg.innerText='invalid email and password';
                        return;
                    };
                    currentUser=user;

                    lemail.value='';
                    lpassword.value='';

                    localStorage.setItem('currentUser',JSON.stringify(currentUser));
                    localStorage.setItem('isLoggedIn','true');
                    localStorage.setItem('users',JSON.stringify(users));

                     if(currentUser.role==='admin'){
                        showadmin();
                    }else{
                        showtodo();
                    }

                });

                todobtn.addEventListener('click',()=>{
                    const text=todoinput.value.trim();

                    if(!text){
                        return;
                    };

                    currentUser.todos.push({
                        text,
                        completed:false,
                    });
                    todoinput.value='';
                    saverender();
                });

                function rendertodo(){
                    todolist.innerHTML='';

                    let  todoshow = [...currentUser.todos];

                    if(currentfilter==='completed'){
                        todoshow=todoshow.filter(t=>t.completed);     
                    }
                    if(currentfilter==='pending'){
                        todoshow=todoshow.filter(t=>!t.completed);
                    };

                    const searchtext=searchinput.value.trim().toLowerCase();
                    if(searchtext){
                        todoshow=todoshow.filter(t=>t.text.toLowerCase().includes(searchtext));
                    };
                    todoshow.forEach((todo,index)=>{
                        const li=document.createElement('li');

                        const checkbox=document.createElement('input');
                        checkbox.type='checkbox';
                        checkbox.checked=todo.completed;

                        checkbox.addEventListener('change',()=>{
                            todo.completed=checkbox.checked;
                            saverender();
                        });
                        const span=document.createElement('span');
                        span.innerText=todo.text;
                        span.style.textDecoration=todo.completed ?'line-through':'none';

                        const editbtn=document.createElement('button');
                        editbtn.innerText='edit';

                        const cancelbtn=document.createElement('button');
                        cancelbtn.innerText='cancel';

                        const input=document.createElement('input');
                        input.type='text';
                        input.value=todo.text;

                        editbtn.addEventListener('click',()=>{
                            li.innerHTML='';

                           const savebtn=document.createElement('button');
                            savebtn.innerText='save';

                            savebtn.addEventListener('click',()=>{
                                if(!input.value.trim()){
                                    return;
                                };

                                currentUser.todos[index].text=input.value.trim();
                                saverender();
                            });
                            cancelbtn.addEventListener('click',()=>{
                                rendertodo();
                            });
                            li.append(input,savebtn,cancelbtn);
                            input.focus();
                        });
                        const dltbtn=document.createElement('button');
                        dltbtn.innerText='delete';

                        dltbtn.addEventListener('click',()=>{
                            currentUser.todos.splice(index,1);
                            saverender();
                        });
                        li.append(checkbox,span,editbtn,dltbtn);
                        todolist.appendChild(li);
                    })
                };

                function saverender(){
                    users=users.map(u=>u.email===currentUser.email ?currentUser:u);

                    localStorage.setItem('currentUser',JSON.stringify(currentUser));
                    localStorage.setItem('users',JSON.stringify(users));
                    showcount();
                    rendertodo();
                };

                function time(datestr){
                    if(!datestr)return 'N/A';

                    const d= new Date(datestr);
                    return d.toLocaleDateString( 'en-IN',{
                        day:'2-digit',
                        month:'short',
                        year:'numeric',
                    })
                };
                function renderadmin(){
                    adminlist.innerHTML='';
                    users.forEach(u=>{
                        const li=document.createElement('li');
                        li.innerText=`${u.email} -${u.name} -(${u.role}) -| joined on ${time(u.date)}`;
                        adminlist.appendChild(li);
                    })
                };

                function showcount(){

                    const total=currentUser.todos.length;
                    const completed=currentUser.todos.filter(t=>t.completed).length;
                    const pending=currentUser.todos.filter(t=>!t.completed).length;

                    allbtn.innerText=`all (${total})`;
                    completedbtn.innerText=`completed (${completed})`;
                    pendingbtn.innerText=`pending (${pending})`;
                }
                fpasswordbtn.addEventListener('click',()=>{
                    const email=femail.value.trim();
                    const npass=npassword.value.trim();
                    const cpass=cpassword.value.trim();

                    if(!email || !npass || !cpass){
                        fmsg.innerText='all feilds are required';
                        return;
                    };

                    const userindex=users.findIndex(u=>u.email===email);

                    if(userindex===-1){
                        fmsg.innerText='user not found';
                        return;
                    }
                    if(npass !==cpass){
                        fmsg.innerText='password do not match';
                        return;
                    };
                    if(npass.length<6){
                        fmsg.innerText='password must be at least 6 characters long';
                        return;
                    };

                    users[userindex].password=npass;

                    femail.value='';
                    npassword.value='';
                    cpassword.value='';

                    fmsg.innerText='password reset successfully'
                    
                    saverender();
                    showlogin();
                });
                changepassbtn.addEventListener('click',()=>{
                    const oldpassword=oldpass.value.trim();
                    const newpassword=newpass.value.trim();
                    const confirmpassword=confirmpass.value.trim();

                    if(!oldpassword || !newpassword || !confirmpassword){
                        passmsg.innerText='all feilds are required';
                        return;
                    };
                    if(currentUser.password !==oldpassword){
                        passmsg.innerText='old password is incorrect';
                        return;
                    };
                    if(newpassword !==confirmpassword){
                        passmsg.innerText='new password and confirmpassword not match';
                        return;
                    };
                    if(newpassword === oldpassword){
                        passmsg.innerText='password must be different to old password';
                        return;
                    };
                    if(newpassword.length<6){
                        passmsg.innerText='password must be at least 6 characters long';
                        return;
                    };

                    currentUser.password=newpassword;

                    oldpass.value='';
                    newpass.value='';
                    confirmpass.value='';
                    passmsg.innerText='password change successfully';

                    saverender();
                    });
                    logoutbtn.addEventListener('click',()=>{
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('isLoggedIn');

                        currentUser=null;
                        currentfilter='all';
                        showlogin();
                    });
                    logoutadmin.addEventListener('click',()=>{
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('isLoggedIn');

                        showlogin();
                    });
                    resetbtn.addEventListener('click',()=>{
                        currentUser.todos=[];

                        currentfilter='all';
                        saverender();
                    });
                    markall.addEventListener('click',()=>{
                        currentUser.todos.forEach(u=>{
                            u.completed=true
                        })
                        saverender();
                    });
                    removemark.addEventListener('click',()=>{
                        currentUser.todos.forEach(u=>{
                            u.completed=false
                        })
                        saverender();
                    });
                    function showadmin(){
                        users=JSON.parse(localStorage.getItem('users'))||[];
                        loginform.style.display='none';
                        signupform.style.display='none';
                        todosection.style.display='none';
                        admin.style.display='block';
                        fpassword.style.display='none';
                        changepass.style.display='none';
                        admintxt.innerText=`welcome,${currentUser.name}`;
                        renderadmin();

                    };
                    function showforgotpass(){
                        loginform.style.display='none';
                        signupform.style.display='none';
                        admin.style.display='none';
                        fpassword.style.display='block';
                        changepass.style.display='none';
                        todosection.style.display='none';
                    };
                    function showlogin(){
                        loginform.style.display='block';
                        signupform.style.display='none';
                        admin.style.display='none';
                        todosection.style.display='none';
                        fpassword.style.display='none';
                        changepass.style.display='none';
                    };
                    function showsignup(){
                        loginform.style.display='none';
                        signupform.style.display='block';
                        admin.style.display='none';
                        todosection.style.display='none';
                        fpassword.style.display='none';
                        changepass.style.display='none';
                    }
                    function showtodo(){
                        todosection.style.display='block';
                        loginform.style.display='none';
                        signupform.style.display='none';
                        admin.style.display='none';
                        changepass.style.display='block';
                        fpassword.style.display='none';
                        welcometxt.innerText=`welcome, ${currentUser.name}`;
                        rendertodo();
                    }
                  window.addEventListener("DOMContentLoaded", () => {
                     if (!isLoggedIn) {
                      showsignup();
                    }
                 });



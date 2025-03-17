import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { useEffect, useState } from "react"

//Drawer 
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

const API = "http://localhost:3000/data"

type Todo = {
  id: string;
  name: string;
  surname : string;
  status : string;
};


export default function Todolist(){
 const [data, setData] = useState<Todo[]>([])
 const [error, setError] = useState<string | null>(null);
 
 const [selectedUser, setSelectedUser] = useState<Todo>({
  id:"",
  name:"",
  surname:"",
  status:""
 })
 
//set EDIT 
const [openEdit, setOpenEdit] = useState(false)
const [openInfo, setOpenInfo] = useState(false)

function handleCloseEdit(){
  return setOpenEdit(false)
}
function handleCloseInfo(){
  return setOpenInfo(false)
}

 //GET
 const getData = async ()=>{
  try {
    const {data} = await axios.get<Todo[]>(API)
    setData(data)
    
  } catch (error) {
    setError("Ошибка загрузки данных");
    console.error(error);
}
};

//DELETE
 async function deleteUser (idx:string){
  try {
    console.log(idx);
    
     const {data} = await axios.delete<Todo[]>(`${API}/${idx}`)
     setData(data);
     getData();
  } catch (error) {
    setError("Ошибка загрузки данных");
    console.error(error);
  }
}

//EDIT
async function editUser (user:{id:string,name:string,surname:string,status:string},id:string){
  try {
       const {data} = await axios.put(`${API}/${id}`,user)
       setData(data)
       getData()
  } catch (error) {
    setError("Ошибка загрузки данных");
    console.error(error);
  }
}

//ADD
const [newUser,setNewUser] = useState({
  id:Date.now().toString(),
  name:"",
  surname:"",
  status:"false"
})

async function addNew (user:{id:string,name:string,surname:string,status:string}){
  try {
    const {data}= await axios.post(API,user)
    setData(data)
    getData()
  } catch (error) {
    setError("Ошибка загрузки данных");
    console.error(error);
  }
}

useEffect (()=>{
  getData();
}, []);

if (error) return <p>{error}</p>;

  return <>
  <div className="flex w-95 m-auto my-15 align-center justify-center">
  <Input value={newUser.name} onChange={(e)=>setNewUser({...newUser,name:e.target.value})} className="w-64 m-auto" placeholder="Name"/>
  <Input value={newUser.surname} onChange={(e)=>setNewUser({...newUser,surname:e.target.value})} className="w-64 m-auto" placeholder="Surname"/>
  <Button onClick={()=>addNew(newUser)} className="w-22">Add new</Button>
  </div>
  <Table className="w-3xl bg-gray-800 text-white rounded-2xl m-auto ">
  <TableCaption className="text-gray-700 rounded-4xl text-md font-semibold ">Todolist with shadcn-tailwind-async</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px] text-white">Name</TableHead>
      <TableHead  className="text-white">Surname</TableHead>
      <TableHead  className="text-white">Status</TableHead>
      <TableHead  className="text-white flex justify-center items-center">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((user)=>
    <TableRow key={user.id}>
    <TableCell className="font-medium">{user.name}</TableCell>
    <TableCell className="font-medium">{user.surname}</TableCell>
    <TableCell>{user.status?"Active":"inactive"}</TableCell>
    <TableCell>
      <div className="flex justify-center">
        <Button onClick={()=>deleteUser(user.id)} className="bg-red-500 hover:bg-amber-400">Detele</Button>
        <Button onClick={()=>{setOpenInfo(true)
          setSelectedUser(user)
        }} className="bg-gray-500 hover:bg-blue-400">Info</Button>
        <Button onClick={()=>{setOpenEdit(true)
          setSelectedUser(user)
        }} className="bg-green-500 hover:bg-green-700">Edit</Button>
      </div>
    </TableCell>
  </TableRow>)}
  </TableBody>
</Table>

{/**Drawer Edir */}
<Drawer open={openEdit} onClose={handleCloseEdit}>
  <DrawerContent className="w-86 m-auto">
    <DrawerHeader>
      <DrawerTitle>Edit user</DrawerTitle>
      <DrawerDescription>
        <Input value={selectedUser.name} onChange={(e)=>setSelectedUser({...selectedUser,name:e.target.value})} placeholder="name" />
        <Input value={selectedUser.surname} onChange={(e)=>setSelectedUser({...selectedUser,surname:e.target.value})} placeholder="surname" />
      </DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button onClick={()=>editUser(selectedUser,selectedUser.id)}>Submit</Button>
      <DrawerClose>
        <Button onClick={()=>handleCloseEdit()} variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

{/**Drawer info */}

<Drawer open={openInfo} onClose={handleCloseInfo}>
  <DrawerContent className="w-86 m-auto">
    <DrawerHeader>
      <DrawerTitle className="text-2xl mb-2.5 border-b-2 border-b-gray-700">Info user</DrawerTitle>
      <DrawerDescription>
        <Input  className="bg-amber-200 mb-1.5 text-black rounded-2xl" value={selectedUser.name} placeholder="name" />
        <Input  className="bg-amber-200 text-black rounded-2xl" value={selectedUser.surname} placeholder="surname" />
      </DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose>
        <Button onClick={()=>handleCloseInfo()} variant="default">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
  </>
}
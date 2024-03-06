import { component$, useStore, useVisibleTask$, $, useSignal } from '@builder.io/qwik';
import { User } from '~/models/user';
import { addUser, deleteUserByDni, getUsers, updateUser, getMinors, getAdults } from '~/utils/users-provider';

export const UsersList = component$(() => {

    const store = useStore<{ users: User[] }>({
        users: []
    })

    const form = useStore({
        dni: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        fecha_nacimiento: ''
    })

    const addOrModify = useSignal("Añadir")

    const oldDni = useSignal("")

    const UserByAge = useSignal("Todos")

    useVisibleTask$(async () => {
        console.log("Desde useVisibleTask")
        store.users = await getUsers()
    })

    const handleSubmit = $(async (event) => {
        event.preventDefault() //Evita el comportamiento por defecto
        if (addOrModify.value === 'Añadir') {
            await addUser(form)
        } else {
            await updateUser(oldDni.value, form)
            addOrModify.value = "Añadir"
        }
    })

    const handleInputChange = $((event: any) => {
        const target = event.target as HTMLInputElement
        form[target.name] = target.value
    })

    const copyForm = $((user: User) => {
        form.dni = user.dni
        form.nombre = user.nombre
        form.apellido = user.apellido
        form.telefono = user.telefono
        form.direccion = user.direccion
        form.fecha_nacimiento = user.fecha_nacimiento

    })

    const cleanForm = $(() => {
        form.dni = ""
        form.nombre = ""
        form.apellido = ""
        form.telefono = ""
        form.direccion = ""
        form.fecha_nacimiento = ""

    })


    const deleteUser = $(async (dni: string) => {
        await deleteUserByDni(dni)
        store.users = await getUsers()
    })

    return (
        <div class="flex justify-center">
            <div>
                <div class="px-6 py-4 bg-alanturing-100 rounded-lg">
                    <table class="border-separate border-spacing-2">
                        <thead>
                            <tr>
                                <th class="tittle">DNI</th>
                                <th class="tittle">Nombre</th>
                                <th class="tittle">Apellido</th>
                                <th class="tittle">Telefono</th>
                                <th class="tittle">Direccion</th>
                                <th class="tittle">Fecha de nac.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.users.map((user) => (
                                <tr key={user.dni}>
                                    <td>{user.dni}</td>
                                    <td>{user.nombre}</td>
                                    <td>{user.apellido}</td>
                                    <td>{user.telefono}</td>
                                    <td>{user.direccion}</td>
                                    <td>{user.fecha_nacimiento}</td>
                                    <td>
                                        <button class="bg-red-600" onClick$={() => deleteUser(user.dni)}><i class="fa-solid fa-trash"></i>Borrar</button>
                                    </td>
                                    <td>
                                        <button class="bg-orange-600" onClick$={() => { addOrModify.value = 'Modificar'; oldDni.value = user.dni; copyForm(user) }}><i class="fa-solid fa-pen"></i>Modificar</button>
                                    </td>
                                </tr>))}
                            <tr>
                                <form onSubmit$={handleSubmit}>
                                    <td><input name='dni' type="text" value={form.dni} onInput$={handleInputChange} /></td>
                                    <td><input name='nombre' type="text" value={form.nombre} onInput$={handleInputChange} /></td>
                                    <td><input name='apellido' type="text" value={form.apellido} onInput$={handleInputChange} /></td>
                                    <td><input name='telefono' type="text" value={form.telefono} onInput$={handleInputChange} /></td>
                                    <td><input name='direccion' type="text" value={form.direccion} onInput$={handleInputChange} /></td>
                                    <td><input name='fecha_nacimiento' type="date" value={form.fecha_nacimiento} onInput$={handleInputChange} /></td>
                                    <td><button class="bg-green-600" type='submit'><i class="fa-solid fa-check"></i>Aceptar</button></td>
                                    <td><span class="button bg-red-600" style={`visibility: ${addOrModify.value === 'Añadir' ? 'hidden' : 'visible'}`} onClick$={() => { addOrModify.value = "Añadir"; cleanForm() }}><i class="fa-solid fa-xmark"></i>Cancelar</span></td>
                                </form>
                            </tr>
                        </tbody>
                    </table>
                </div >
                <button class={UserByAge.value === 'Todos' ? 'button-age-hightlighted' : 'button-age'} onClick$={async () => { UserByAge.value = 'Todos'; store.users = await getUsers()}}><i class="fa-solid fa-users"></i>Todos</button>
                <button class={UserByAge.value === 'Menores' ? 'button-age-hightlighted' : 'button-age'} onClick$={async () => { UserByAge.value = 'Menores'; store.users = await getMinors()}}><i class="fa-solid fa-child"></i>Menores de edad</button>
                <button class={UserByAge.value === 'Mayores' ? 'button-age-hightlighted' : 'button-age'} onClick$={async () => { UserByAge.value = 'Mayores'; store.users = await getAdults()}}><i class="fa-solid fa-person-cane"></i>Mayores de edad</button>
            </div>
        </div>
    )
});
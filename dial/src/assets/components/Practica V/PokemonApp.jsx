import { useState, useEffect , useLayoutEffect} from "react"
import "./pokeStyles.css"
import PokemonList from "./PokemonList";
import PokeHeader from "./PokeHeader";
import axios from "axios";
import PokemonPage from "./PokemonPage";
import DontFind from "./DontFind";


function PokemonApp(){

    const [img, setImg] = useState([
        {
          url:"https://wallpaper.dog/large/749981.jpg"
        },
        {
          url: "https://wallpaper.dog/large/20352460.jpg"
        },
        {
            url: "https://wallpapers.com/images/hd/pikachu-with-pokemon-friends-uxxa8pvbvsqj0v3h.jpg"
          }
      ])
        const page20 = 20;
        const allpage= 905;
       
    const[pokemonData, setPokemonData] = useState([]);
    const[pokeDex,setPokeDex]=useState();
    const[url,setUrl]= useState(`https://pokeapi.co/api/v2/pokemon?limit=${page20}&offset=0`)
    const[nextUrl,setNextUrl]=useState()
    const[prevUrl,setPrevUrl]=useState()
    const[loading,setLoading]=useState(true)
    const [modal, setModal] = useState(false);
    const[fondo, setFondo] = useState(img[0].url)
    const [busqueda, setBusqueda] = useState(false)
    const [find, setFind] = useState("");
    const[clear, setClear]= useState(false)

    function handleFind(e){
        
        if(e.target.value != ""){
            setBusqueda(true)
            setFind(e.target.value)
        }else if(e.target.value == ""){
            setBusqueda(false)
            setFind(e.target.value)
            setUrl(`https://pokeapi.co/api/v2/pokemon?limit=${page20}&offset=0`)
        }
      };


    function submitFind(e){
        e.preventDefault()
        if(busqueda == false){
            alert("debes escribir algo para hacer la busqueda")
            setUrl(`https://pokeapi.co/api/v2/pokemon?limit=${page20}&offset=0`)
            setPokemonData([])
            loadData()
            setClear(true)
        }else if (busqueda ==true){
            setUrl(`https://pokeapi.co/api/v2/pokemon?limit=${allpage}&offset=0`)
            
            loadAllData()
            setClear(true)
        }
    }




  function toggleModal(){
    setModal(!modal);
  };

  async function loadData(){

        const resp = await axios.get(`${url}`);
                setNextUrl(resp.data.next)
                setPrevUrl(resp.data.previous)
                getPokemon(resp.data.results)
                setLoading(false)
    }

    async function getPokemon(res){
        res.map(async(item)=>{
            const result = await axios.get(item.url)
                setPokemonData(state=>{
                    let hash = {};
                    state=[...state,result.data]
                    state.sort((a,b)=>a.id>b.id?1:-1)
                    state = state.filter(o => hash[o.id] ? false : hash[o.id] = true);
                    return state
                })

        })
    }

    

    async function loadAllData (){
        const resp = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${allpage}&offset=0`);
                
        getAllPokemon(resp.data.results)     
    }

    async function getAllPokemon(res){
        res.map(async(item)=>{
            const result = await axios.get(item.url)
            setPokemonData(state=>{
                let hash = {};
                state=[...state,result.data]
                state = state.filter(o => hash[o.id] ? false : hash[o.id] = true);
                state = state.filter(pokemon=>{
                    if(pokemon.name.includes(find.toLowerCase())){

                        return pokemon
                    }else if(pokemon.id == (Math.floor(find))){
                        return pokemon
                    }
                    
                })
                return state
            })
           
        })
    }

    function clearSearch (){
        
            setFind("");
            setBusqueda(false);
            setUrl(`https://pokeapi.co/api/v2/pokemon?limit=${page20}&offset=0`);
            setPokemonData([]);
            setClear(false)
    }

    function backgroundChange(){
        const backGround = document.getElementById("pokeBody")
            const num = img[Math.floor(Math.random()*img.length)]
            setFondo(num.url)
    }


    useLayoutEffect(()=>{
        if(busqueda == false){
        setPokemonData([])
        loadData();
       
       
        } else if(busqueda == true){
            loadAllData();
        
           
            }
    },[url])


    
 

    return(
        
        <div id="pokeBody" className="pokeBody" style={{ background: `url(${fondo})`}}>
        <PokeHeader 
        handleFind={handleFind}
        submitFind={submitFind}
        find={find}
        busqueda={busqueda}
        clearSearch={clearSearch}
        clear={clear}
        />
        {modal && pokemonData.length > 19 ? <div className="div-reyeno"></div>: <PokemonList 
        pokemonData={pokemonData} 
        loading={loading} 
        infoPokemon={poke=>{setPokeDex(poke)
            toggleModal()}} 
        pokeDex={pokeDex}
        setUrl={setUrl}
        prevUrl={prevUrl}
        nextUrl={nextUrl}
        setPokemonData={setPokemonData}
        busqueda={busqueda}/>}
{pokemonData.length <= 0 && busqueda ? <DontFind/> : ""}
        {modal && <PokemonPage data={pokeDex} setPokeDex={()=>{
            setPokeDex("")
            toggleModal()}}/>}
        </div>
        
    )
}


export default PokemonApp



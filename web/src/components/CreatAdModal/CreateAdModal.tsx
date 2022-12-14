import React, { useState, useEffect, FormEvent } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import Input from "../Form/Input";
import { GameController, Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import axios from 'axios';

interface Game {
    id: string;
    title: string;
}

export default function CreateAdModal() {
const [games, setGames] = useState<Game[]>([]);
const [weekDays, setWeekDays] = useState<string[]>([]);
const [useVoiceChannel, setUseVoiceChannel] = useState(false);


  useEffect(() => {
    axios('http://localhost:3333/games')
    .then((res) => {
      setGames(res.data);
    })
  }, []);

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    console.log(data);

    if(!data.name) {
        return;
    }

    try {
        await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
            "name": data.name,
            "yearsPlaying": Number(data.yearsPlaying),
            "discord": data.discord,
            "weekDays": weekDays.map(Number),
            "hourStart": data.hourStart,
            "hourEnd": data.hourEnd,
            "useVoiceChannel": useVoiceChannel,
        })
        alert('Anúncio criado com sucesso');

      } catch (err) {
        console.log(err)
        alert('Erro ao criar o anúncio');
      }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-[#2a2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black">
          Publique um anúncio
        </Dialog.Title>
        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold ">
              Qual o game?
            </label>
            <select 
                id="game"
                name="game" 
                className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500"
            >
                <option value="" disabled defaultValue=''>Selecione o game que deseja jogar </option>

                {games.map(game => {
                    return <option key={game.id} value={game.id}>{game.title}</option>
                })}


            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Seu nome (ou nickname)</label>
            <Input name='name' id="name" placeholder="Como te chamam dentro do game?" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
              <Input
                type="number"
                name='yearsPlaying' id="yearsPlaying"
                placeholder="Tudo bem ser ZERO"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Qual seu Discord?</label>
              <Input name='discord' id="discord" placeholder="Usuario#0000" />
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">Quando costuma jogar?</label>
                <ToggleGroup.Root 
                    type='multiple' 
                    className="grid grid-cols-4 gap-2"
                    value={weekDays}
                    onValueChange={setWeekDays}
                >
                    <ToggleGroup.Item 
                        title="Domingo" 
                        className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('0') ? 'bg-violet-500' : ''}`}
                        value='0'
                        >
                    D
                    </ToggleGroup.Item>
                    <ToggleGroup.Item 
                        title="Segunda" 
                        className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('1') ? 'bg-violet-500' : ''}`}
                        value='1'
                    >
                    S
                    </ToggleGroup.Item>
                    <ToggleGroup.Item 
                        title="Terça" 
                        className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('2') ? 'bg-violet-500' : ''}`}
                        value='2'
                        
                    >
                    T
                    </ToggleGroup.Item>
                    <ToggleGroup.Item 
                        title="Quarta" 
                        className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('3') ? 'bg-violet-500' : ''}`}
                        value='3'
                    >
                    Q
                    </ToggleGroup.Item>
                    <ToggleGroup.Item 
                        title="Quinta" 
                        className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('4') ? 'bg-violet-500' : ''}`}
                        value='4'
                    >
                    Q
                    </ToggleGroup.Item>
                    <ToggleGroup.Item 
                        title="Sexta" 
                        className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('5') ? 'bg-violet-500' : ''}`}
                        value='5'
                    >
                    S
                    </ToggleGroup.Item>
                    <ToggleGroup.Item 
                        title="Sábado" 
                        className={`w-8 h-8 rounded bg-zinc-900 ${weekDays.includes('6') ? 'bg-violet-500' : ''}`}
                        value='6'
                    >
                    S
                    </ToggleGroup.Item>
                </ToggleGroup.Root>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="hourStart">Qual horário do dia?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="time" name='hourStart' id="hourStart" placeholder="De" />
                <Input type="time" name='hourEnd' id="hourEnd" placeholder="Até" />
              </div>
            </div>
          </div>
          <label className="mt-2 flex gap-2 text-sm items-center">
            <Checkbox.Root 
                className="w-6 h-6 rounded bg-zinc-900"
                checked={useVoiceChannel}
                onCheckedChange={(checked) => {
                    if (checked == true) {
                        setUseVoiceChannel(true);
                    } else {
                        setUseVoiceChannel(false);
                    }
                }}
            >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 rounded text-esmerald-400" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>
          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
            >
              Cancelar
            </Dialog.Close>
            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
            >
              <GameController size={24} />
              Encontrar duo
            </button>
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

import { useEffect, useState } from "react";
import { getChatRooms, getMessages, createChatRoom } from "./api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { socket } from "./lib/socket";

interface ChatRoom {
  id: number;
  name: string;
}

interface Message {
  id: number;
  content: string;
  created_at: string;
}

function App() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    loadRooms();
    socket.connect();
  }, []);

  const loadRooms = async () => {
    const res = await getChatRooms();
    setRooms(res.data.values);
  };

  useEffect(() => {
    if (!currentRoom) return;

    socket.clearCallbacks();
    socket.subscribe(currentRoom.id);
    getMessages(currentRoom.id).then((res) => setMessages(res.data));

    const messageHandler = (message: Message) => setMessages(prev => [...prev, message]);
    socket.onMessage(messageHandler);

    return () => socket.clearCallbacks();
  }, [currentRoom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentRoom || !input.trim()) return;

    socket.sendMessage(currentRoom.id, input.trim());
    setInput("");
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    try {
      await createChatRoom(newRoomName.trim());
      setNewRoomName("");
      setIsDialogOpen(false);
      loadRooms();
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl dark:bg-slate-800">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-center dark:text-white">
            Realtime Chat
          </CardTitle>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto text-white hover:dark:bg-slate-700">New Room</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Chat Room</DialogTitle>
              </DialogHeader>
              <Input
                placeholder="Room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button className="text-white" onClick={handleCreateRoom}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="p-6">
          <div className="flex gap-6">
            <div className="w-1/3">
              <h2 className="font-semibold mb-4 dark:text-slate-200">Chat Rooms</h2>
              <div className="space-y-2">
                {rooms.map((room) => (
                  <Button
                    key={room.id}
                    variant={currentRoom?.id === room.id ? "secondary" : "outline"}
                    className="w-full hover:dark:bg-slate-700"
                    onClick={() => setCurrentRoom(room)}
                  >
                    {room.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="w-2/3">
              {currentRoom ? (
                <>
                  <Card className="dark:bg-gray-600 border-0">
                    <CardContent className="h-[500px] overflow-y-auto space-y-3 p-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="bg-muted rounded-lg p-3 dark:bg-slate-700"
                        >
                          <span className="text-sm text-muted-foreground dark:text-slate-400 block mb-1">
                            {msg.created_at}
                          </span>
                          <p className="dark:text-slate-200">{msg.content}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="dark:bg-slate-800 dark:text-slate-200"
                    />
                    <Button
                      type="submit"
                      className="dark:bg-slate-700 dark:text-white hover:dark:bg-slate-600"
                    >
                      Send
                    </Button>
                  </form>
                </>
              ) : (
                <p className="text-muted-foreground dark:text-slate-400 text-center pt-20">
                  Select a room to start chatting
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
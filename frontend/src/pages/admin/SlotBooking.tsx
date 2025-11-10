import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Edit, Building, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLayout from "@/components/AdminLayout";

// LocalStorage keys
const VENUES_STORAGE_KEY = 'venues';
const SLOTS_STORAGE_KEY = 'slots';

// Interfaces
interface Venue {
  id: number;
  name: string;
  block: string;
  maxSeats: number;
  ipRange?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Slot {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  venueId: number;
  slotFor: string;
  residence: string;
  gender: string;
  allowBooking: string;
  maxSeats: number;
  seatsLeft: number;
  createdBy: string;
  venue?: Venue;
  createdAt?: string;
  updatedAt?: string;
}

// Default form data
const defaultVenueData: Partial<Venue> = {
  name: "",
  block: "",
  maxSeats: 30,
};

const defaultSlotData: Partial<Slot> = {
  date: new Date().toISOString().split('T')[0],
  startTime: "09:00",
  endTime: "10:00",
  venueId: 0,
  slotFor: "Internal",
  residence: "Hosteller",
  gender: "All",
  allowBooking: "Yes",
  maxSeats: 30,
  seatsLeft: 30,
  createdBy: "Admin",
};

const SlotBooking = () => {
  const { toast } = useToast();
  
  // Add error boundary
  const [error, setError] = useState<string | null>(null);
  
  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Page</h2>
            <p className="text-red-600 mt-2">{error}</p>
            <Button 
              onClick={() => setError(null)} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }
  const [venues, setVenues] = useState<Venue[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Venue form state
  const [venueForm, setVenueForm] = useState<Partial<Venue>>(defaultVenueData);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  
  // Slot form state
  const [slotForm, setSlotForm] = useState<Partial<Slot>>(defaultSlotData);
  const [editingSlot, setEditingSlot] = useState<Slot | null>(null);
  const [slotDate, setSlotDate] = useState<Date | undefined>(new Date());

  // Load data on component mount
  useEffect(() => {
    try {
      loadVenuesFromStorage();
      loadSlotsFromStorage();
      setPageLoading(false);
    } catch (err) {
      console.error('Error in useEffect:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setPageLoading(false);
    }
  }, []);

  // LocalStorage functions
  const loadVenuesFromStorage = () => {
    try {
      const storedVenues = localStorage.getItem(VENUES_STORAGE_KEY);
      if (storedVenues) {
        setVenues(JSON.parse(storedVenues));
      }
    } catch (error) {
      console.error('Error loading venues from storage:', error);
      setError('Failed to load venues from storage');
    }
  };

  const saveVenuesToStorage = (venuesData: Venue[]) => {
    try {
      localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify(venuesData));
    } catch (error) {
      console.error('Error saving venues to storage:', error);
    }
  };

  const loadSlotsFromStorage = () => {
    try {
      const storedSlots = localStorage.getItem(SLOTS_STORAGE_KEY);
      if (storedSlots) {
        setSlots(JSON.parse(storedSlots));
      }
    } catch (error) {
      console.error('Error loading slots from storage:', error);
    }
  };

  const saveSlotsToStorage = (slotsData: Slot[]) => {
    try {
      localStorage.setItem(SLOTS_STORAGE_KEY, JSON.stringify(slotsData));
    } catch (error) {
      console.error('Error saving slots to storage:', error);
    }
  };

  // Venue handlers
  const handleVenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueForm.name || !venueForm.block || !venueForm.maxSeats) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let updatedVenues: Venue[];
      
      if (editingVenue) {
        // Update existing venue
        updatedVenues = venues.map(venue => 
          venue.id === editingVenue.id 
            ? { ...venue, ...venueForm, updatedAt: new Date().toISOString() }
            : venue
        );
        toast({ title: "Success", description: "Venue updated successfully" });
      } else {
        // Add new venue
        const newVenue: Venue = {
          id: Date.now(), // Simple ID generation
          name: venueForm.name!,
          block: venueForm.block!,
          maxSeats: venueForm.maxSeats!,
          ipRange: venueForm.ipRange,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedVenues = [...venues, newVenue];
        toast({ title: "Success", description: "Venue created successfully" });
      }
      
      setVenues(updatedVenues);
      saveVenuesToStorage(updatedVenues);
      setVenueForm(defaultVenueData);
      setEditingVenue(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save venue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditVenue = (venue: Venue) => {
    setVenueForm(venue);
    setEditingVenue(venue);
  };

  const handleDeleteVenue = (id: number) => {
    if (!confirm('Are you sure you want to delete this venue?')) return;
    
    try {
      const updatedVenues = venues.filter(venue => venue.id !== id);
      setVenues(updatedVenues);
      saveVenuesToStorage(updatedVenues);
      toast({ title: "Success", description: "Venue deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete venue",
        variant: "destructive",
      });
    }
  };

  // Slot handlers
  const handleSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotDate || !slotForm.startTime || !slotForm.endTime || !slotForm.venueId) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const selectedVenue = venues.find(v => v.id === slotForm.venueId);
      let updatedSlots: Slot[];
      
      if (editingSlot) {
        // Update existing slot
        updatedSlots = slots.map(slot => 
          slot.id === editingSlot.id 
            ? { 
                ...slot, 
                ...slotForm,
                date: slotDate.toISOString().split('T')[0],
                venue: selectedVenue,
                updatedAt: new Date().toISOString()
              }
            : slot
        );
        toast({ title: "Success", description: "Slot updated successfully" });
      } else {
        // Add new slot
        const newSlot: Slot = {
          id: Date.now(),
          date: slotDate.toISOString().split('T')[0],
          startTime: slotForm.startTime!,
          endTime: slotForm.endTime!,
          venueId: slotForm.venueId!,
          slotFor: slotForm.slotFor!,
          residence: slotForm.residence!,
          gender: slotForm.gender!,
          allowBooking: slotForm.allowBooking!,
          maxSeats: slotForm.maxSeats || selectedVenue?.maxSeats || 30,
          seatsLeft: slotForm.maxSeats || selectedVenue?.maxSeats || 30,
          createdBy: slotForm.createdBy!,
          venue: selectedVenue,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedSlots = [...slots, newSlot];
        toast({ title: "Success", description: "Slot created successfully" });
      }
      
      setSlots(updatedSlots);
      saveSlotsToStorage(updatedSlots);
      setSlotForm(defaultSlotData);
      setSlotDate(new Date());
      setEditingSlot(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save slot",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSlot = (slot: Slot) => {
    setSlotForm(slot);
    setSlotDate(new Date(slot.date));
    setEditingSlot(slot);
  };

  const handleDeleteSlot = (id: number) => {
    if (!confirm('Are you sure you want to delete this slot?')) return;
    
    try {
      const updatedSlots = slots.filter(slot => slot.id !== id);
      setSlots(updatedSlots);
      saveSlotsToStorage(updatedSlots);
      toast({ title: "Success", description: "Slot deleted successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete slot",
        variant: "destructive",
      });
    }
  };

  if (pageLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading slot booking management...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Slot Booking Management</h1>
            <p className="text-muted-foreground">
              Create slots for course modules and manage bookings
            </p>
          </div>
        </div>

        <Tabs defaultValue="venue" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="venue" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Manage Venues
            </TabsTrigger>
            <TabsTrigger value="slot" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Create Slots
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {editingVenue ? 'Edit Venue' : 'Add New Venue'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVenueSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueName">Venue Name *</Label>
                      <Input
                        id="venueName"
                        value={venueForm.name || ''}
                        onChange={(e) => setVenueForm({...venueForm, name: e.target.value})}
                        placeholder="Enter venue name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venueBlock">Venue Block *</Label>
                      <Input
                        id="venueBlock"
                        value={venueForm.block || ''}
                        onChange={(e) => setVenueForm({...venueForm, block: e.target.value})}
                        placeholder="Enter venue block"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxSeats">Max Seats *</Label>
                      <Input
                        id="maxSeats"
                        type="number"
                        min="1"
                        value={venueForm.maxSeats || ''}
                        onChange={(e) => setVenueForm({...venueForm, maxSeats: parseInt(e.target.value) || 0})}
                        placeholder="Enter max seats"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : editingVenue ? 'Update Venue' : 'Add Venue'}
                    </Button>
                    {editingVenue && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setVenueForm(defaultVenueData);
                          setEditingVenue(null);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Venues</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Max Seats</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {venues.map((venue) => (
                      <TableRow key={venue.id}>
                        <TableCell className="font-medium">{venue.name}</TableCell>
                        <TableCell>{venue.block}</TableCell>
                        <TableCell>{venue.maxSeats}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditVenue(venue)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteVenue(venue.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {venues.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No venues found</p>
                    <p className="text-sm">Create your first venue using the form above</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="slot" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {editingSlot ? 'Edit Slot' : 'Create New Slot'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSlotSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Slot Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !slotDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {slotDate ? format(slotDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={slotDate}
                            onSelect={setSlotDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="venue">Venue *</Label>
                      <Select
                        value={slotForm.venueId?.toString() || ''}
                        onValueChange={(value) => {
                          const venueId = parseInt(value);
                          const selectedVenue = venues.find(v => v.id === venueId);
                          setSlotForm({
                            ...slotForm, 
                            venueId,
                            maxSeats: selectedVenue?.maxSeats || 30,
                            seatsLeft: selectedVenue?.maxSeats || 30
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select venue" />
                        </SelectTrigger>
                        <SelectContent>
                          {venues.length === 0 ? (
                            <SelectItem value="no-venues" disabled>
                              No venues available - Add a venue first
                            </SelectItem>
                          ) : (
                            venues.map((venue) => (
                              <SelectItem key={venue.id} value={venue.id.toString()}>
                                {venue.name} - {venue.block} ({venue.maxSeats} seats)
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={slotForm.startTime || ''}
                        onChange={(e) => setSlotForm({...slotForm, startTime: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={slotForm.endTime || ''}
                        onChange={(e) => setSlotForm({...slotForm, endTime: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={loading || venues.length === 0}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : editingSlot ? 'Update Slot' : 'Create Slot'}
                    </Button>
                    {editingSlot && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setSlotForm(defaultSlotData);
                          setSlotDate(new Date());
                          setEditingSlot(null);
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Seats</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {slots.map((slot) => (
                      <TableRow key={slot.id}>
                        <TableCell>{format(new Date(slot.date), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{slot.startTime} - {slot.endTime}</TableCell>
                        <TableCell>{slot.venue?.name} - {slot.venue?.block}</TableCell>
                        <TableCell>{slot.seatsLeft}/{slot.maxSeats}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSlot(slot)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSlot(slot.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {slots.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No slots found</p>
                    <p className="text-sm">Create your first slot using the form above</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SlotBooking;
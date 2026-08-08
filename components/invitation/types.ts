export interface RsvpFormValues {
  name: string;
  attendance: 'yes' | 'no';
  guestSide: 'groom' | 'bride';
  guests: string;
  message: string;
}

export interface TicketData extends RsvpFormValues {
  ticketNumber: string;
}

export const DEFAULT_RSVP_FORM_VALUES: RsvpFormValues = {
  name: '',
  attendance: 'yes',
  guestSide: 'groom',
  guests: '1 位',
  message: ''
};

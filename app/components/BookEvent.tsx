'use client';

import { useState } from "react";
import { createBooking } from "../actions/booking.actions";
import posthog from "posthog-js";

function BookEvent({ eventId }: { eventId: string }) {
    const [email, setEmail] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { success, message } = await createBooking({ eventId, email });

            if (!success) throw new Error(message);

            setSubmitted(true);
            posthog.capture('event_booked', { eventId, email });
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <div id="book-event">
            {
                submitted
                    ? <p className="text-sm">Thank you for booking your spot!</p>
                    : (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email">Your email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value)}
                                    id="email"
                                    placeholder="Type your email address..."
                                />
                            </div>
                            <button className="button-submit" type="submit">Place Booking</button>
                        </form>
                    )
            }
        </div>
    )
}

export default BookEvent

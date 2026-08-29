'use client';

import { useState } from "react";

function BookEvent() {
    const [email, setEmail] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitted(true);
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

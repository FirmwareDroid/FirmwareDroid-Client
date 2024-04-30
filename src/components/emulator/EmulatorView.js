import {Button, ButtonGroup, Col, Container, Form, InputGroup, Row, Spinner, ToggleButton} from "react-bootstrap";
import {CiLocationOn} from "react-icons/ci";
import React, {useContext, useState} from "react";
import {Emulator} from "android-emulator-webrtc/emulator";

function EmulatorView({     index,
                          emulatorConnectionState,
                          setEmulatorConnectionState,
                          hasEmulatorAudio,
                          setHasEmulatorAudio,
                          longitudeValue,
                          setLongitudeValue,
                          latitudeValue,
                          setLatitudeValue,
                          hasEmulatorError,
                          setHasEmulatorError,
                          emulatorErrorMessage,
                          setEmulatorErrorMessage,
                          gpsLocation,
                          setGpsLocation,
                          volumeState,
                          setVolumeState,
                          radioEmulatorViewValue,
                          setRadioEmulatorViewValue,
                          emulatorUri,
                          setEmulatorUri,
                          radiosEmulatorView}) {
    const [showEmulator, setShowEmulator] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleEmulatorUriChange = (e) => {
        const newUri = String(e.target.value);
        let emulatorUris = JSON.parse(sessionStorage.getItem('emulatorUris')) || [];
        emulatorUris[index] = newUri;
        sessionStorage.setItem('emulatorUris', JSON.stringify(emulatorUris));
        setEmulatorUri(newUri);
    };

    const onChangeEmulatorView = (e) => {
        setRadioEmulatorViewValue(e.currentTarget.value)
    };

    const onEmulatorError = (error) => {
        console.error("Emulator error", error)
        if (!error.contains("receiveJsepMessages")) {
            setHasEmulatorError(true);
            setEmulatorErrorMessage(error);
        }
    }

    const onEmulatorStateChange = (state) => {
        console.info("Emulator state changed", state)
        setEmulatorConnectionState({ emuState: state });
        if (state === "connected") {
            setIsLoading(false);
        }
    }

    const handleConnectClick = () => {
        setShowEmulator(true);
        setIsLoading(true);
    };


    return (<>
            <Container>
                <Row>
                    <Col>
                        {hasEmulatorError &&
                            <p>Oopps...some connection problem occurred!</p>
                        }
                        {isLoading && showEmulator &&
                            <Button
                                variant={"outline-light"}
                                disabled>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Connecting...
                            </Button>
                        }
                        {showEmulator && !hasEmulatorError &&
                            <Emulator
                                uri={emulatorUri}
                                width={100}
                                height={400}
                                onError={onEmulatorError}
                                onStateChange={onEmulatorStateChange}
                                onAudioStateChange={(audioState) => setHasEmulatorAudio({hasAudio: audioState})}
                                view={radioEmulatorViewValue}
                                gps={gpsLocation}
                                volume={volumeState.volume}
                                muted={volumeState.muted}
                            />
                        }
                        {!showEmulator &&
                            <Button
                                variant={"outline-light"}
                                onClick={handleConnectClick}>Connect
                            </Button>
                        }
                    </Col>
                    <Col>
                        {!hasEmulatorError && <p>State: {emulatorConnectionState.emuState}</p>}
                        {hasEmulatorError && <p>State: ERROR</p>}
                        <Form className="mt-3 mb-3">
                            <Form.Group controlId="userInput">
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    placeholder="Emulator URL"
                                    value={emulatorUri}
                                    onChange={handleEmulatorUriChange}
                                />
                            </Form.Group>
                        </Form>
                        <ButtonGroup size="sm" className="mr-3 mb-3">
                            {radiosEmulatorView.map((radio, idx) => (
                                <ToggleButton
                                    key={`${idx}-${index}`}
                                    id={`radio-${idx}-${index}`}
                                    type="radio"
                                    variant={"outline-light"}
                                    name={`radio-${index}`}
                                    value={radio.value}
                                    checked={radioEmulatorViewValue.toString() === radio.value.toString()}
                                    onChange={onChangeEmulatorView}
                                >
                                    {radio.name}
                                </ToggleButton>
                            ))}
                        </ButtonGroup>
                        <InputGroup size="sm" className="mb-3">
                            <Button
                                type="submit"
                                color="inherit"
                                variant={"outline-light"}
                                onClick={(e) => setGpsLocation({
                                        gps: {
                                            latitude: latitudeValue,
                                            longitude: longitudeValue
                                        }
                                    }
                                )}
                                size="large">
                                <CiLocationOn/>
                            </Button>
                            <Form.Control
                                aria-label="Longitude"
                                type="float"
                                required
                                onChange={(e) => setLongitudeValue(Number(e.target.value))}
                                placeholder="Longitude"
                            />
                            <Form.Control
                                aria-label="Latitude"
                                type="float"
                                required
                                onChange={(e) => setLatitudeValue(Number(e.target.value))}
                                placeholder="Latitude"
                            />
                        </InputGroup>
                        <Form
                            disabled={hasEmulatorAudio}
                        >
                            <Form.Label>
                                Volume {Math.floor(volumeState.volume * 100)}%
                            </Form.Label>
                            <Form.Range
                                min='0'
                                max='1'
                                step='0.01'
                                onChange={(e) => {
                                    let value = Number(e.target.value)
                                    let muted = value === 0
                                    setVolumeState({volume: value, muted: muted})
                                }}
                                value={volumeState.volume}
                                disabled={false}
                            />
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default EmulatorView;




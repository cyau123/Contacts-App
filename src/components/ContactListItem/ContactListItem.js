import { Button, Icon, Item, Segment, Grid } from "semantic-ui-react";
import "./ContactListItem.css"

export default function ContactListItem({contact}) {

    return (
            <Grid>
                <Grid.Row className="dotted-underline" style= {{ paddingTop: "30px", paddingBottom: "16px" }}>
                    <Grid.Column width={4}>
                        <Item.Group>
                            <Item>
                                <Item.Image size="large" src="/user.png"/>
                            </Item>
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Item.Group className="dotted-underline">
                            <Item>
                                <Item.Content>
                                    <Item.Header style={{ color: "#8bd0dd" }}>{contact.name}</Item.Header>
                                    <Item.Description style={{ color: "#8bd0dd" }}>Username: {contact.username}</Item.Description>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                        <Item.Group>
                            <Item>
                                <Item.Content>
                                    <div>
                                        <Icon name="phone" /> {contact.phone}
                                    </div>
                                    <div>
                                        <Icon name="mail" /> {contact.email}
                                    </div>
                                    <div>
                                        <Icon name="marker" /> {contact.address.suite}, {contact.address.street}, {contact.address.city}, {contact.address.zipcode}
                                    </div>
                                    <Icon name="globe" />{contact.website}
                                </Item.Content>
                            </Item>
                        </Item.Group>
                        <Item.Group>
                            <Item>
                                <Item.Content>
                                    <div>
                                        <strong>Company:</strong> {contact.company.name}
                                    </div>
                                    <div>
                                        <strong>Catchphrase:</strong> {contact.company.catchPhrase}
                                    </div>
                                    <div>
                                        <strong>Business Strategy:</strong> {contact.company.bs}
                                    </div>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            )
}